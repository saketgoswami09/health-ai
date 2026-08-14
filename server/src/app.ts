import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import healthRoutes from './routes/healthRoutes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middleware
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

// Routes
app.use('/api', healthRoutes);

// Error Handling
app.use(errorHandler);

export default app;
