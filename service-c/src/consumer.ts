import { consumer } from './kafka.js';
import { TOPICS, TodoEvent } from 'shared';
import { createTodoNode } from './repository.js';

export async function startConsuming() {
  await consumer.subscribe({ topic: TOPICS.TODOS_CLEAN, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          console.warn('[Service C] Received empty message');
          return;
        }

        const todo: TodoEvent = JSON.parse(message.value.toString());
        
        // Save to Neo4j first
        await createTodoNode(todo);
        
        console.log('\n[Service C] ═══ Final Todo Received ═══');
        console.log(`correlationId: ${todo.correlationId}`);
        console.log(`id: ${todo.id}`);
        console.log(`title: ${todo.title}`);
        console.log(`message: ${todo.message}`);
        console.log(`createdAt: ${todo.createdAt}`);
        console.log('═══════════════════════════════════════\n');
        
      } catch (error) {
        console.error('[Service C] Error processing message:', error);
      }
    },
  });
}
