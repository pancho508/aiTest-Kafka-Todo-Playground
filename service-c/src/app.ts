import { connectConsumer, disconnectConsumer } from './kafka.js';
import { startConsuming } from './consumer.js';
import { connectDatabase, disconnectDatabase } from './database.js';

async function start() {
  try {
    await connectDatabase();
    await connectConsumer();
    await startConsuming();
    console.log('[Service C] Started consuming from todos.clean');
  } catch (error) {
    console.error('[Service C] Failed to start:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('\n[Service C] Shutting down gracefully...');
  await disconnectConsumer();
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
