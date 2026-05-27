import { producer } from './kafka.js';
import { TOPICS, TodoEvent } from 'shared';

export async function publishTodo(todo: TodoEvent): Promise<void> {
  try {
    await producer.send({
      topic: TOPICS.TODOS_RAW,
      messages: [
        {
          key: todo.id,
          value: JSON.stringify(todo),
        },
      ],
    });
    
    console.log(`[Service A] Published todo | correlationId=${todo.correlationId} | topic=${TOPICS.TODOS_RAW}`);
  } catch (error) {
    console.error('[Service A] Failed to publish todo:', error);
    throw error;
  }
}
