# Kafka Todo Playground

Event-driven microservices playground demonstrating Kafka message flow with TypeScript.

## Architecture

```
POST /todos → Service A → todos.raw → Service B → todos.clean → Service C
              (Producer)   (topic)    (Transform)   (topic)      (Display)
```

## Services

- **Service A** (Producer API): REST API that publishes todo events to `todos.raw`
- **Service B** (Transformer): Consumes from `todos.raw`, transforms title with `[CLEAN]` prefix, publishes to `todos.clean`
- **Service C** (Final Consumer): Consumes from `todos.clean` and displays formatted output

## Tech Stack

- **TypeScript** (ES2022 modules)
- **KafkaJS** v2.2.0 (Kafka client)
- **Fastify** v4.0 (HTTP server for Service A)
- **Docker Compose** (Kafka infrastructure)
- **pnpm workspaces** (monorepo management)

## Quick Start

```bash
# 1. Start Kafka infrastructure
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Start services (in separate terminals)
cd service-b && pnpm dev  # Transformer (start first)
cd service-c && pnpm dev  # Final consumer
cd service-a && pnpm dev  # Producer API

# 4. Send test request
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","message":"Remember to buy milk"}'
```

## Expected Output

**Service A:**
```
[Service A] Published todo | correlationId=xxx | topic=todos.raw
```

**Service B:**
```
[Service B] Received todo | correlationId=xxx | topic=todos.raw
[Service B] Transforming todo | correlationId=xxx
[Service B] Published transformed todo | topic=todos.clean
```

**Service C:**
```
[Service C] ═══ Final Todo Received ═══
correlationId: xxx
title: [CLEAN] Buy milk
message: Remember to buy milk
```

## Kafka UI

Access Kafka UI at http://localhost:8080 to inspect topics and messages.

## Project Structure

```
├── shared/              # Shared types and constants
│   ├── src/
│   │   ├── types/todo.ts    # TodoEvent interface
│   │   └── kafka/topics.ts  # TOPICS constants
├── service-a/           # Producer API
│   ├── src/
│   │   ├── kafka.ts         # Producer connection
│   │   ├── producer.ts      # publishTodo function
│   │   ├── routes/todos.ts  # POST /todos endpoint
│   │   └── app.ts           # Fastify server
├── service-b/           # Transformer
│   ├── src/
│   │   ├── kafka.ts         # Producer & consumer connections
│   │   ├── producer.ts      # Publish transformed todos
│   │   ├── consumer.ts      # Consume & transform
│   │   └── app.ts           # Start consumer
├── service-c/           # Final Consumer
│   ├── src/
│   │   ├── kafka.ts         # Consumer connection
│   │   ├── consumer.ts      # Consume & display
│   │   └── app.ts           # Start consumer
└── docker-compose.yml   # Kafka infrastructure
```

## Key Concepts Demonstrated

- ✅ **Kafka Producers** - Publishing events
- ✅ **Kafka Consumers** - Consuming events from topics
- ✅ **Event Transformation** - Middleware pattern for data enrichment
- ✅ **Consumer Groups** - Isolated consumption per service
- ✅ **Type Safety** - Shared TypeScript interfaces
- ✅ **Correlation IDs** - End-to-end request tracing
- ✅ **Graceful Shutdown** - SIGINT/SIGTERM handlers
- ✅ **Monorepo** - Shared code via pnpm workspaces

## Development

Built following a 6-phase implementation plan:
- Phase 0: Workspace setup
- Phase 1: Docker infrastructure
- Phase 2: Shared package
- Phase 3: Service A (Producer)
- Phase 4: Service B (Transformer)
- Phase 5: Service C (Consumer)
- Phase 6: End-to-end validation

See `phase-*.md` files for detailed implementation guides.

