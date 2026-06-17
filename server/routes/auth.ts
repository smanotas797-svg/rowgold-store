import { Router } from "express";
import { db, usersTable } from "../db/index.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createHash } from "crypto";

const router = Router();

const RegisterBody = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function hashPassword(password: string): string {
  return createHash("sha256").update(password + "rowgold-salt-2024").digest("hex");
}

type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

const sessions: Record<string, SessionUser> = {};

function getSessionId(req: import("express").Request): string {
  return (req.headers["x-session-id"] as string | undefined) ?? "default-session";
}

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterBody.parse(req.body);
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existing) {
      res.status(400).json({ error: "Email ya registrado" });
      return;
    }
    const [user] = await db
      .insert(usersTable)
      .values({ email: body.email, name: body.name, passwordHash: hashPassword(body.password), role: "customer" })
      .returning();
    const sid = getSessionId(req);
    sessions[sid] = { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.name, role: user.role, createdAt: user.createdAt },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to register");
    res.status(400).json({ error: "Solicitud inválida" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminUsername && adminPassword && body.email === adminUsername && body.password === adminPassword) {
      const sid = getSessionId(req);
      const adminUser: SessionUser = {
        id: 0,
        email: adminUsername,
        name: "Administrador",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      sessions[sid] = adminUser;
      res.json({ user: { id: 0, email: adminUser.email, username: adminUser.name, role: "admin", createdAt: adminUser.createdAt } });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user || user.passwordHash !== hashPassword(body.password)) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }
    const sid = getSessionId(req);
    sessions[sid] = { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
    res.json({
      user: { id: user.id, email: user.email, username: user.name, role: user.role, createdAt: user.createdAt },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to login");
    res.status(400).json({ error: "Solicitud inválida" });
  }
});

router.post("/auth/logout", async (req, res) => {
  try {
    const sid = getSessionId(req);
    delete sessions[sid];
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to logout");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    const sid = getSessionId(req);
    const sessionUser = sessions[sid];
    if (!sessionUser) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }
    res.json({ id: sessionUser.id, email: sessionUser.email, username: sessionUser.name, role: sessionUser.role, createdAt: sessionUser.createdAt });
  } catch (err) {
    req.log.error({ err }, "Failed to get me");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
