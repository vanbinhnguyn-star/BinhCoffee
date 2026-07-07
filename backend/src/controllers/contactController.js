import ContactMessage from '../models/ContactMessage.js';

// User gửi liên hệ
export const sendContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    const contact = await ContactMessage.create({ name, email, message });

    // Thông báo realtime cho admin
    const io = req.app.get('io');
    if (io) {
      io.to('admins').emit('new_contact', {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt
      });
    }

    res.status(201).json({ message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin lấy danh sách liên hệ
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort('-createdAt');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin đánh dấu đã đọc
export const markRead = async (req, res) => {
  try {
    await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Đã đánh dấu đọc' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin xóa liên hệ
export const deleteContact = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};