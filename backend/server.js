import app from './src/app.js';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const basePort = Number(process.env.PORT) || 5000;
const maxRetries = 5;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// ✅ Gắn io vào app để các controller dùng được
app.set('io', io);

const adminSockets = new Set();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('user_join', (data) => {
    socket.userData = data;
    adminSockets.forEach(adminId => {
      io.to(adminId).emit('user_connected', {
        socketId: socket.id,
        userName: data.userName
      });
    });
  });

  socket.on('admin_join', () => {
    adminSockets.add(socket.id);
    socket.join('admins'); // ✅ Thêm vào room 'admins' để dễ broadcast
  });

  socket.on('user_message', (data) => {
    adminSockets.forEach(adminId => {
      io.to(adminId).emit('user_message', {
        socketId: socket.id,
        userName: socket.userData?.userName || 'Khách',
        text: data.text,
        time: data.time
      });
    });
  });

  socket.on('admin_reply', (data) => {
    io.to(data.targetSocketId).emit('admin_reply', {
      text: data.text,
      time: data.time
    });
  });

  socket.on('disconnect', () => {
    if (adminSockets.has(socket.id)) {
      adminSockets.delete(socket.id);
    } else {
      adminSockets.forEach(adminId => {
        io.to(adminId).emit('user_disconnected', socket.id);
      });
    }
  });
});

const startServer = (port, attempt = 1) => {
  httpServer.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  httpServer.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < maxRetries) {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use. Trying ${nextPort}...`);
      startServer(nextPort, attempt + 1);
    } else {
      console.error('Server error:', error);
    }
  });
};

startServer(basePort);