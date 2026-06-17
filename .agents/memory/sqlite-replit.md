---
name: SQLite en Replit sin compilación nativa
description: Cómo usar SQLite con Drizzle ORM en Replit (Node 24) sin paquetes nativos.
---

## Regla

Usar `node:sqlite` (built-in Node 24) + `drizzle-orm/sqlite-proxy` con un callback sync.

**Why:** `better-sqlite3` y `@libsql/client` requieren node-gyp (C++/Rust) que falla en Replit porque no hay g++/make disponibles. `node:sqlite` está incorporado en Node 24 (experimental pero funcional) y no requiere ningún paquete adicional.

**How to apply:**

```typescript
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { DatabaseSync } from "node:sqlite";

const sqlite = new DatabaseSync("./sqlite.db");
sqlite.exec("PRAGMA journal_mode = WAL");

export const db = drizzle(async (sql, params, method) => {
  const stmt = sqlite.prepare(sql);
  if (method === "run") {
    stmt.run(...params);
    return { rows: [] };
  } else if (method === "get") {
    const row = stmt.get(...params) as Record<string, unknown> | undefined;
    return { rows: row ? [Object.values(row)] : [] };
  } else {
    const rows = stmt.all(...params) as Record<string, unknown>[];
    return { rows: rows.map(r => Object.values(r)) };
  }
}, { schema });
```

- El schema usa `drizzle-orm/sqlite-core` (igual que con better-sqlite3).
- `.returning()` funciona correctamente.
- `drizzle.config.ts` usa `dialect: "sqlite"`, `dbCredentials: { url: "./sqlite.db" }`.
- En package.json NO incluir `better-sqlite3`, `@types/better-sqlite3`, `@libsql/client`.
