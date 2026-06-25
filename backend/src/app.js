import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export default app;