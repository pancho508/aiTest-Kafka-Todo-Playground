# PHASE 4 — Service B (Transformer)

## service-b/package.json
```json
{
  "name": "service-b",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "start": "node dist/app.js",
    "build": "tsc"
  },
  "dependencies": {
    "kafkajs": "^2.2.0",
    "shared": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## service-b/tsconfig.json
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

## service-b/src/kafka.ts
```typescript
import { Kafka, Producer, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'todo-transformer',
  brokers: ['localhost:9092'],
});

export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: 'todo-middleman-group' });

export async function connectKafka() {
  await producer.connect();
  await consumer.connect();
  console.log('[Service B] Kafka producer and consumer connected');
}

export async function disconnectKafka() {
  await consumer.disconnect();
  await producer.disconnect();
  console.log('[Service B] Kafka disconnected');
}
```

## service-b/src/producer.ts
```typescript
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
```

## service-b/src/consumer.ts
```typescript
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
```

## service-b/src/app.ts
```typescript
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
```

## Validation
After POSTing to Service A, check Service B logs for:
- "Received todo" message
- "Transforming todo" message
- "Published transformed todo" message
- Kafka UI shows message in todos.clean topic

---

# Engineering Journal

## 2024-05-27 12:53

**Status**: ✅ COMPLETED

**Actions Taken**:
1. Created service-b/package.json with KafkaJS and workspace dependency on shared
2. Created service-b/tsconfig.json with ES2022 configuration
3. Created service-b/src/kafka.ts (producer & consumer connection management)
4. Created service-b/src/producer.ts (publishTransformedTodo function)
5. Created service-b/src/consumer.ts (consume from todos.raw, transform, publish to todos.clean)
6. Created service-b/src/app.ts (start consumer with graceful shutdown)
7. Ran `pnpm install` in service-b directory

**Dependencies Installed**:
- kafkajs: 2.2.4
- shared: 1.0.0 (workspace)
- tsx: 4.22.3 (dev)
- typescript: 5.9.3 (dev)

**Completed**:
- All TypeScript source files created
- Consumer subscribes to todos.raw topic
- Transformer prefixes titles with "[CLEAN]"
- Producer publishes to todos.clean topic
- Consumer group: todo-middleman-group
- Graceful shutdown handlers (SIGINT, SIGTERM)
- Package dependencies installed successfully

**Next Phase**: Phase 5 - Service C (Final Consumer)
- 

### Validation
- 

### Next Steps
- 
