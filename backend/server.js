import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const basePort = Number(process.env.PORT) || 5000;
const maxRetries = 5;

const startServer = (port, attempt = 1) => {
  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < maxRetries) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
};

startServer(basePort);