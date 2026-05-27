# PHASE 0 — Workspace Setup

## Target Structure
```
kafka-playground/
├── package.json (root workspace)
├── pnpm-workspace.yaml
├── docker-compose.yml
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/todo.ts
│       └── kafka/topics.ts
├── service-a/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       ├── kafka.ts
│       ├── producer.ts
│       └── routes/todos.ts
├── service-b/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       ├── kafka.ts
│       ├── consumer.ts
│       └── producer.ts
└── service-c/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app.ts
        ├── kafka.ts
        └── consumer.ts
```

## Files to Create

### package.json (root)
```json
{
  "name": "kafka-playground",
  "private": true,
  "workspaces": ["shared", "service-a", "service-b", "service-c"],
  "scripts": {
    "dev:a": "pnpm --filter service-a dev",
    "dev:b": "pnpm --filter service-b dev",
    "dev:c": "pnpm --filter service-c dev"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'shared'
  - 'service-a'
  - 'service-b'
  - 'service-c'
```

---

# Engineering Journal

## 2026-05-27 12:44

### Completed
- Created root package.json with workspace configuration
- Created pnpm-workspace.yaml defining all workspace packages
- Created directory structure for all services (shared, service-a, service-b, service-c)
- Created nested src directories with proper structure

### Decisions
- Using pnpm (v10.30.3) for workspace management
- Monorepo structure to enable shared package imports
- Workspace protocol (`workspace:*`) will be used for internal dependencies

### Issues
- None

### Validation
- ✅ pnpm installed and available (v10.30.3)
- ✅ All directories created successfully
- ✅ package.json and pnpm-workspace.yaml in place

### Next Steps
- Proceed to Phase 1: Docker Infrastructure setup 
