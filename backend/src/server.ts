import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  // Attempt PostgreSQL connection
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`🧪 CHEM BROS Production Backend active on http://localhost:${env.PORT}`);
    logger.info(`   Environment: ${env.NODE_ENV}`);
    logger.info(`   Health check: http://localhost:${env.PORT}/health`);
  });

  // Graceful shutdown handling
  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Gracefully terminating server...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Database disconnected and server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap().catch(err => {
  logger.error('Fatal bootstrap failure:', err);
  process.exit(1);
});
