import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { createHash } from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "rowgold-salt-2024").digest("hex");
}

declare module "express" {
  interface Request {
    session?: { userId?: number };
  }
}

const sessions: Record<string, number> = {};

function getSessionId(req: import("express").Request): string {
  return (req.headers["x-session-id"] as string | undefined) ?? "default-session";
}

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterBody.parse(req.body);

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existing) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        email: body.email,
        name: body.name,
        passwordHash: hashPassword(body.password),
        role: "customer",
      })
      .returning();

    const sessionId = getSessionId(req);
    sessions[sessionId] = user.id;

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to register");
    res.status(400).json({ error: "Bad request" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user || user.passwordHash !== hashPassword(body.password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const sessionId = getSessionId(req);
    sessions[sessionId] = user.id;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to login");
    res.status(400).json({ error: "Bad request" });
  }
});

router.post("/auth/logout", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    delete sessions[sessionId];
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to logout");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const userId = sessions[sessionId];

    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get me");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
