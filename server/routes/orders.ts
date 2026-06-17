import { Router } from "express";
import { db, ordersTable, cartItemsTable, productsTable } from "../db/index.js";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const CreateOrderBody = z.object({ shippingAddress: z.string(), paymentMethod: z.string() });
const IdParam = z.object({ id: z.number().int().positive() });
const UpdateStatusBody = z.object({
  status: z.enum(["pending", "payment_confirmed", "preparing", "shipped", "in_transit", "delivered", "cancelled"]),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
});

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pedido Recibido",
  payment_confirmed: "Pago Confirmado",
  preparing: "Preparando Pedido",
  shipped: "Enviado",
  in_transit: "En Camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function getSessionId(req: import("express").Request): string {
  return (req.headers["x-session-id"] as string | undefined) ?? "default-session";
}

function formatOrder(o: typeof ordersTable.$inferSelect) {
  return {
    ...o,
    items: Array.isArray(o.items) ? o.items : [],
    statusHistory: Array.isArray(o.statusHistory) ? o.statusHistory : [],
  };
}

router.get("/orders", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json(orders.map(formatOrder));
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const body = CreateOrderBody.parse(req.body);
    const cartItems = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
    if (cartItems.length === 0) {
      res.status(400).json({ error: "El carrito está vacío" });
      return;
    }
    const orderItems = [];
    let subtotal = 0;
    for (const item of cartItems) {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
      if (!product) continue;
      subtotal += product.price * item.quantity;
      orderItems.push({ productId: item.productId, productName: product.name, quantity: item.quantity, price: product.price, imageUrl: product.imageUrl ?? undefined });
    }
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + shipping;
    const now = new Date().toISOString();
    const [order] = await db.insert(ordersTable).values({
      sessionId,
      status: "pending",
      items: orderItems,
      subtotal,
      shipping,
      total,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      statusHistory: [{ status: "pending", timestamp: now, note: "Pedido recibido exitosamente" }],
    }).returning();
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
    res.status(201).json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(400).json({ error: "Solicitud inválida" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: Number(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) {
      res.status(404).json({ error: "Pedido no encontrado" });
      return;
    }
    res.json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(404).json({ error: "No encontrado" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
    const body = UpdateStatusBody.parse(req.body);
    const [existing] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!existing) { res.status(404).json({ error: "Pedido no encontrado" }); return; }
    const now = new Date().toISOString();
    const history = [...(Array.isArray(existing.statusHistory) ? existing.statusHistory : []),
      { status: body.status, timestamp: now, note: body.note ?? ORDER_STATUS_LABELS[body.status] }];
    const updateData: Record<string, unknown> = { status: body.status, statusHistory: history, updatedAt: now };
    if (body.trackingNumber) updateData.trackingNumber = body.trackingNumber;
    const [updated] = await db.update(ordersTable).set(updateData).where(eq(ordersTable.id, id)).returning();
    res.json(formatOrder(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update order status");
    res.status(400).json({ error: "Solicitud inválida" });
  }
});

export default router;
