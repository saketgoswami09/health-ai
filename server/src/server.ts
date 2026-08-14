import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Accepting requests from client at ${config.clientUrl}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
