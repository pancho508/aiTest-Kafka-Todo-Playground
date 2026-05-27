import { consumer } from './kafka.js';
import { TOPICS, TodoEvent } from 'shared';
import { publishTransformedTodo } from './producer.js';

export async function startConsuming() {
  await consumer.subscribe({ topic: TOPICS.TODOS_RAW, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          console.warn('[Service B] Received empty message');
          return;
        }

        const rawTodo: TodoEvent = JSON.parse(message.value.toString());
        console.log(`[Service B] Received todo | correlationId=${rawTodo.correlationId} | topic=${topic}`);

        // Transform the todo
        const transformedTodo: TodoEvent = {
          ...rawTodo,
          title: `[CLEAN] ${rawTodo.title}`,
        };

        console.log(`[Service B] Transforming todo | correlationId=${transformedTodo.correlationId}`);

        // Publish to next topic
        await publishTransformedTodo(transformedTodo);
        
      } catch (error) {
        console.error('[Service B] Error processing message:', error);
        // In production, send to DLQ
      }
    },
  });
}
