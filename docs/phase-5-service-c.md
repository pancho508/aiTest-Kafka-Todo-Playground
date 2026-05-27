# PHASE 5 — Service C (Final Consumer)

## service-c/package.json
```json
{
  "name": "service-c",
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

## service-c/tsconfig.json
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

## service-c/src/kafka.ts
```typescript
import { Kafka, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'todo-final-consumer',
  brokers: ['localhost:9092'],
});

export const consumer: Consumer = kafka.consumer({ groupId: 'todo-consumer-group' });

export async function connectConsumer() {
  await consumer.connect();
  console.log('[Service C] Kafka consumer connected');
}

export async function disconnectConsumer() {
  await consumer.disconnect();
  console.log('[Service C] Kafka consumer disconnected');
}
```

## service-c/src/consumer.ts
```typescript
import { consumer } from './kafka.js';
import { TOPICS, TodoEvent } from 'shared';

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
```

## service-c/src/app.ts
```typescript
import { connectConsumer, disconnectConsumer } from './kafka.js';
import { startConsuming } from './consumer.js';

async function start() {
  try {
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
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
```

## Validation
After POSTing to Service A, Service C logs should show the formatted final todo with [CLEAN] prefix

---

# Engineering Journal

## 2024-05-27 12:53

**Status**: ✅ COMPLETED

**Actions Taken**:
1. Created service-c/package.json with KafkaJS and workspace dependency on shared
2. Created service-c/tsconfig.json with ES2022 configuration
3. Created service-c/src/kafka.ts (consumer connection management)
4. Created service-c/src/consumer.ts (consume from todos.clean with formatted output)
5. Created service-c/src/app.ts (start consumer with graceful shutdown)
6. Ran `pnpm install` in service-c directory

**Dependencies Installed**:
- kafkajs: 2.2.4
- shared: 1.0.0 (workspace)
- tsx: 4.22.3 (dev)
- typescript: 5.9.3 (dev)

**Completed**:
- All TypeScript source files created
- Consumer subscribes to todos.clean topic
- Formatted console output for received todos
- Consumer group: todo-consumer-group
- Graceful shutdown handlers (SIGINT, SIGTERM)
- Package dependencies installed successfully

**Next Phase**: Phase 6 - End-to-End Validation 

### Issues
- 

### Validation
- 

### Next Steps
- 
