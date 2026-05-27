# PHASE 2 — Shared Package

## shared/package.json
```json
{
  "name": "shared",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

## shared/tsconfig.json
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
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

## shared/src/types/todo.ts
```typescript
export interface TodoEvent {
  id: string;
  correlationId: string;
  createdAt: string;
  title: string;
  message: string;
}
```

## shared/src/kafka/topics.ts
```typescript
export const TOPICS = {
  TODOS_RAW: 'todos.raw',
  TODOS_CLEAN: 'todos.clean',
  TODOS_DLQ: 'todos.dlq',
} as const;
```

## shared/src/index.ts
```typescript
export * from './types/todo.js';
export * from './kafka/topics.js';
```

---

# Engineering Journal

## 2024-05-27 12:51

**Status**: ✅ COMPLETED

**Actions Taken**:
1. Created shared/package.json with ES module configuration
2. Created shared/tsconfig.json with ES2022 target
3. Created shared/src/types/todo.ts (TodoEvent interface)
4. Created shared/src/kafka/topics.ts (TOPICS constants)
5. Created shared/src/index.ts (barrel export)
6. Ran `pnpm install` in shared directory

**Dependencies Installed**:
- @types/node: 20.19.41
- typescript: 5.9.3

**Completed**:
- All TypeScript source files created
- Package dependencies installed successfully

**Next Phase**: Phase 3 - Service A (Producer API) 

### Validation
- 

### Next Steps
- 
