import { connectKafka, disconnectKafka } from './kafka.js';
import { startConsuming } from './consumer.js';

async function start() {
  try {
    await connectKafka();
    await startConsuming();
    console.log('[Service B] Started consuming from todos.raw');
  } catch (error) {
    console.error('[Service B] Failed to start:', error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('\n[Service B] Shutting down gracefully...');
  await disconnectKafka();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
