import { producer } from './kafka.js';
import { TOPICS, TodoEvent } from 'shared';

export async function publishTransformedTodo(todo: TodoEvent): Promise<void> {
  try {
    await producer.send({
      topic: TOPICS.TODOS_CLEAN,
      messages: [
        {
          key: todo.id,
          value: JSON.stringify(todo),
        },
      ],
    });
    
    console.log(`[Service B] Published transformed todo | correlationId=${todo.correlationId} | topic=${TOPICS.TODOS_CLEAN}`);
  } catch (error) {
    console.error('[Service B] Failed to publish transformed todo:', error);
    throw error;
  }
}
