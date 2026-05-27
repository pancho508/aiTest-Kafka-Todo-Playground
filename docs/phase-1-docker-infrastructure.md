# PHASE 1 — Docker Infrastructure

## docker-compose.yml

```yaml
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    networks:
      - kafka-network

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    depends_on:
      - zookeeper
    networks:
      - kafka-network

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181
    depends_on:
      - kafka
    networks:
      - kafka-network

networks:
  kafka-network:
    driver: bridge
```

## Start Infrastructure

```bash
docker compose up -d
```

## Validation

- [ ] `docker ps` shows 3 containers running
- [ ] http://localhost:8080 shows Kafka UI
- [ ] Kafka UI shows broker connected

---

# Engineering Journal

## 2024-05-27 12:50

**Status**: ✅ COMPLETED

**Actions Taken**:
1. Created docker-compose.yml with Confluent Kafka stack
2. Initially attempted Bitnami images (`bitnami/zookeeper:latest`, `bitnami/kafka:latest`) - failed to resolve
3. Switched to Confluent Platform images:
   - confluentinc/cp-zookeeper:7.5.0
   - confluentinc/cp-kafka:7.5.0  
   - provectuslabs/kafka-ui:latest
4. Executed `docker compose up -d` successfully
5. Verified all 3 containers running with `docker ps`

**Containers Running**:
- zookeeper: 0.0.0.0:2181->2181/tcp
- kafka: 0.0.0.0:9092->9092/tcp
- kafka-ui: 0.0.0.0:8080->8080/tcp

**Issues Resolved**:
- Bitnami image resolution failure → used Confluent images instead
- Removed obsolete `version` attribute from docker-compose.yml

**Next Phase**: Phase 2 - Shared Package

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
