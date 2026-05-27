import Fastify from 'fastify';
import { connectProducer, disconnectProducer } from './kafka.js';
import { todoRoutes } from './routes/todos.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(todoRoutes);

async function start() {
  try {
    await connectProducer();
    
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('[Service A] Server running on http://localhost:3000');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('\n[Service A] Shutting down gracefully...');
  await disconnectProducer();
  await fastify.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
