# PHASE 6 — End-to-End Validation

## Startup Order
```bash
# Terminal 1: Infrastructure
docker compose up -d

# Terminal 2: Service B (start first to begin consuming)
cd service-b && pnpm dev

# Terminal 3: Service C
cd service-c && pnpm dev

# Terminal 4: Service A
cd service-a && pnpm dev
```

## Test Flow
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","message":"Remember to buy milk"}'
```

## Expected Output

**Service A logs:**
```
[Service A] Published todo | correlationId=xxx | topic=todos.raw
```

**Service B logs:**
```
[Service B] Received todo | correlationId=xxx | topic=todos.raw
[Service B] Transforming todo | correlationId=xxx
[Service B] Published transformed todo | correlationId=xxx | topic=todos.clean
```

**Service C logs:**
```
[Service C] ═══ Final Todo Received ═══
correlationId: xxx
title: [CLEAN] Buy milk
message: Remember to buy milk
═══════════════════════════════════════
```

## Kafka UI Verification
- Navigate to http://localhost:8080
- Check topics: `todos.raw` and `todos.clean` should have 1 message each
- Verify message content matches expected transformations

## Key Concepts Demonstrated
- **Kafka Producers**: Service A publishes events
- **Kafka Consumers**: Services B & C consume events  
- **Event Transformation**: Service B transforms and republishes
- **Consumer Groups**: Isolated consumption per service
- **Type Safety**: Shared types across all services
- **Correlation IDs**: End-to-end request tracing
- **Graceful Shutdown**: All services handle SIGINT/SIGTERM
- **Error Handling**: Try-catch in consumers to prevent crashes

## Future Enhancements (Optional)
- Dead Letter Queue (DLQ) for failed messages
- Schema validation with Zod
- Retry logic with exponential backoff
- Database persistence in Service C
- Docker containerization of services
- Multiple partitions and partition keys
- Consumer group rebalancing tests

---

# Engineering Journal

## 2024-05-27 12:55

**Status**: ✅ COMPLETED

**Actions Taken**:
1. Started Docker infrastructure (Kafka, Zookeeper, Kafka UI)
2. Started Service B (transformer) first
3. Started Service C (final consumer)
4. Started Service A (producer API)
5. Sent test POST request to http://localhost:3000/todos
6. Verified event flow through all services

**Test Request**:
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","message":"Remember to buy milk"}'
```

**Response**: 201 Created with todo object

**Validation Results**:

✅ **Service A Logs**:
- Published todo to todos.raw topic
- correlationId: 76f2fa4f-c49a-4119-b5a4-a09d40d9adfa

✅ **Service B Logs**:
- Received todo from todos.raw
- Transformed title (added "[CLEAN]" prefix)
- Published transformed todo to todos.clean
- Same correlationId preserved

✅ **Service C Logs**:
- Received final todo from todos.clean
- Displayed formatted output
- Title shows: "[CLEAN] Buy milk"
- Same correlationId preserved

**Event Flow Verified**:
```
POST /todos → Service A → todos.raw → Service B → todos.clean → Service C
                          (raw)        (transform)   (clean)     (display)
```

**Key Concepts Demonstrated**:
- ✅ Kafka Producers (Service A)
- ✅ Kafka Consumers (Services B & C)
- ✅ Event Transformation (Service B adds [CLEAN] prefix)
- ✅ Consumer Groups (isolated per service)
- ✅ Type Safety (shared TodoEvent interface)
- ✅ Correlation IDs (end-to-end request tracing)
- ✅ Graceful Shutdown handlers
- ✅ Error handling in consumers

**Infrastructure Status**:
- Docker containers: 3/3 running (zookeeper, kafka, kafka-ui)
- Kafka UI: http://localhost:8080 (accessible)
- Service A: http://localhost:3000 (REST API active)
- Service B: Consuming from todos.raw
- Service C: Consuming from todos.clean

**Next Steps** (Optional Enhancements):
- Add Dead Letter Queue (DLQ) handling
- Implement schema validation with Zod
- Add retry logic with exponential backoff
- Persist todos to database in Service C
- Containerize services with Docker
- Add multiple partitions for scaling
- Implement consumer group rebalancing tests

## Project Complete! 🎉

All 6 phases successfully completed. The Kafka event-driven microservices playground is fully functional. 
