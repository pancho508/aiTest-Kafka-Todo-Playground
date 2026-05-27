# PHASE 3 — Service A (Producer API)

## service-a/package.json
```json
{
  "name": "service-a",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "start": "node dist/app.js",
    "build": "tsc"
  },
  "dependencies": {
    "fastify": "^4.0.0",
    "kafkajs": "^2.2.0",
    "shared": "workspace:*",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/uuid": "^9.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## service-a/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

## service-a/src/kafka.ts
```typescript
import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'todo-producer',
  brokers: ['localhost:9092'],
});

export const producer: Producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log('[Service A] Kafka producer connected');
}

export async function disconnectProducer() {
  await producer.disconnect();
  console.log('[Service A] Kafka producer disconnected');
}
```

## service-a/src/producer.ts
```typescript
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
```

## service-a/src/routes/todos.ts
```typescript
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
```

## service-a/src/app.ts
```typescript
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
```

## Validation
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","message":"Remember to buy milk"}'
```

Expected: 201 response with todo object, Kafka UI shows message in todos.raw

---

# Engineering Journal

## 2024-05-27 12:52

**Status**: ✅ COMPLETED

**Actions Taken**:
1. Created service-a/package.json with Fastify, KafkaJS, and workspace dependency on shared
2. Created service-a/tsconfig.json with ES2022 configuration
3. Created service-a/src/kafka.ts (producer connection management)
4. Created service-a/src/producer.ts (publishTodo function)
5. Created service-a/src/routes/todos.ts (POST /todos endpoint)
6. Created service-a/src/app.ts (Fastify server with graceful shutdown)
7. Ran `pnpm install` in service-a directory

**Dependencies Installed**:
- fastify: 4.29.1
- kafkajs: 2.2.4
- shared: 1.0.0 (workspace)
- uuid: 9.0.1
- tsx: 4.22.3 (dev)
- typescript: 5.9.3 (dev)

**Completed**:
- All TypeScript source files created
- REST API with POST /todos endpoint
- Kafka producer configured for localhost:9092
- Graceful shutdown handlers (SIGINT, SIGTERM)
- Package dependencies installed successfully

**Next Phase**: Phase 4 - Service B (Transformer)

### Completed
- 

### Decisions
- 

### Issues
- 

### Validation
- 

### Next Steps
- 
