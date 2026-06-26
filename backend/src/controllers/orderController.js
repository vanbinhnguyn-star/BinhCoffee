import Order from '../models/Order.js';
import Product from '../models/Product.js';

// User: Create order
export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user.userId;

  // Lưu lại các sản phẩm đã trừ stock để rollback nếu có lỗi
  const stockDeducted = [];

  try {
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // Dùng findOneAndUpdate atomic: chỉ trừ stock khi còn đủ hàng
      // Nếu stock < quantity thì không update và trả về null
      const product = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      // Nếu null: sản phẩm không tồn tại hoặc không đủ hàng
      if (!product) {
        // Tìm lại để biết lý do cụ thể
        const found = await Product.findById(item.productId);

        // Rollback stock cho các sản phẩm đã trừ trước đó
        if (stockDeducted.length > 0) {
          await Promise.all(
            stockDeducted.map(({ productId, quantity }) =>
              Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } })
            )
          );
        }

        if (!found) {
          return res.status(404).json({ message: `Sản phẩm không tồn tại` });
        }
        return res.status(400).json({
          message: `"${found.name}" không đủ hàng. Còn lại: ${found.stock}`
        });
      }

      // Ghi nhận đã trừ stock để rollback nếu cần
      stockDeducted.push({ productId: product._id, quantity: item.quantity });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });

      totalAmount += product.price * item.quantity;
    }

    // Tạo đơn hàng sau khi tất cả stock đã được trừ thành công
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    await order.save();
    await order.populate('user', 'name email');

    res.status(201).json(order);

  } catch (error) {
    // Rollback nếu có lỗi không mong muốn (mất kết nối DB, v.v.)
    if (stockDeducted.length > 0) {
      await Promise.all(
        stockDeducted.map(({ productId, quantity }) =>
          Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } })
        ).catch(() => {}) // Bỏ qua lỗi rollback, không làm crash thêm
      );
    }
    res.status(500).json({ message: error.message });
  }
};

// User: Get my orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'name price')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};