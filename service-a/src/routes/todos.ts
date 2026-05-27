import { FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { TodoEvent } from 'shared';
import { publishTodo } from '../producer.js';

export async function todoRoutes(fastify: FastifyInstance) {
  fastify.post('/todos', async (request, reply) => {
    const body = request.body as { title?: string; message?: string };

    if (!body.title || !body.message) {
      return reply.code(400).send({
        success: false,
        error: 'title and message are required',
      });
    }

    const todo: TodoEvent = {
      id: uuidv4(),
      correlationId: uuidv4(),
      createdAt: new Date().toISOString(),
      title: body.title,
      message: body.message,
    };

    try {
      await publishTodo(todo);
      
      return reply.code(201).send({
        success: true,
        todo,
      });
    } catch (error) {
      return reply.code(503).send({
        success: false,
        error: 'Failed to publish event',
      });
    }
  });
}
