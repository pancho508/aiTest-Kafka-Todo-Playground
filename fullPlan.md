# Kafka Todo Playground — Implementation Guide

**Optimized for automated build with minimal intervention**

## Quick Reference

**Stack**: TypeScript, Node.js, KafkaJS, Fastify, Docker Compose, pnpm  
**Services**: Service A (API Producer), Service B (Transformer), Service C (Consumer)  
**Topics**: todos.raw → todos.clean  
**Ports**: Kafka 9092, Zookeeper 2181, Kafka UI 8080, Service A 3000

## Architecture Flow

```
POST /todos → Service A → todos.raw → Service B → todos.clean → Service C
```

## Implementation Phases

Each phase has been separated into its own file for easier reference:

- **[Phase 0: Workspace Setup](phase-0-workspace-setup.md)** - Monorepo structure, root package.json, pnpm workspace
- **[Phase 1: Docker Infrastructure](phase-1-docker-infrastructure.md)** - Kafka, Zookeeper, Kafka UI with docker-compose
- **[Phase 2: Shared Package](phase-2-shared-package.md)** - Shared types and topic constants
- **[Phase 3: Service A](phase-3-service-a.md)** - Producer API with Fastify
- **[Phase 4: Service B](phase-4-service-b.md)** - Transformer/middleman worker
- **[Phase 5: Service C](phase-5-service-c.md)** - Final consumer
- **[Phase 6: Validation](phase-6-validation.md)** - End-to-end testing and verification

## Project Structure
```
kafka-playground/
├── package.json (workspace root)
├── pnpm-workspace.yaml
├── docker-compose.yml
├── shared/ (types & constants)
├── service-a/ (API producer on :3000)
├── service-b/ (transformer worker)
└── service-c/ (final consumer)
```

## Quick Start

Follow the phases in order:

1. Set up workspace and monorepo structure
2. Start Docker infrastructure (Kafka + Zookeeper + UI)
3. Create shared package with types
4. Build Service A (API Producer)
5. Build Service B (Transformer)
6. Build Service C (Consumer)
7. Run end-to-end validation

See [Phase 6](phase-6-validation.md) for startup commands and testing instructions.

---

## Engineering Notes

Each phase file includes an **Engineering Journal** section at the bottom for documenting:
- Completed work
- Architectural decisions
- Issues encountered and fixes
- Validation results
- Next steps

Journal entries should be appended chronologically as you work through each phase.