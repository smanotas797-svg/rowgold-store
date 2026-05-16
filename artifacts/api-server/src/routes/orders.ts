import { Router } from "express";
import { db, ordersTable, cartItemsTable, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";
import { z } from "zod";

const router = Router();

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
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping ?? 0),
    total: Number(o.total),
    items: (o.items as unknown[]) ?? [],
    statusHistory: (o.statusHistory as unknown[]) ?? [],
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt?.toISOString() ?? o.createdAt.toISOString(),
  };
}

// GET /orders — list all (admin) or session orders
router.get("/orders", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));

    res.json(orders.map(formatOrder));
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /orders — create order
router.post("/orders", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const body = CreateOrderBody.parse(req.body);

    const cartItems = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

    if (cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
      if (!product) continue;
      const price = Number(product.price);
      subtotal += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price,
        imageUrl: product.imageUrl ?? undefined,
      });
    }

    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + shipping;
    const now = new Date().toISOString();

    const [order] = await db
      .insert(ordersTable)
      .values({
        sessionId,
        status: "pending",
        items: orderItems,
        subtotal: String(subtotal),
        shipping: String(shipping),
        total: String(total),
        shippingAddress: body.shippingAddress,
        paymentMethod: body.paymentMethod,
        statusHistory: [{ status: "pending", timestamp: now, note: "Pedido recibido exitosamente" }],
      })
      .returning();

    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

    res.status(201).json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(400).json({ error: "Bad request" });
  }
});

// GET /orders/:id
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = GetOrderParams.parse({ id: Number(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(formatOrder(order));
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(404).json({ error: "Not found" });
  }
});

// PATCH /orders/:id/status — admin updates order status
const UpdateStatusBody = z.object({
  status: z.enum(["pending", "payment_confirmed", "preparing", "shipped", "in_transit", "delivered", "cancelled"]),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const body = UpdateStatusBody.parse(req.body);

    const [existing] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const now = new Date().toISOString();
    const history = [...((existing.statusHistory as unknown[]) ?? []),
      { status: body.status, timestamp: now, note: body.note ?? ORDER_STATUS_LABELS[body.status] }];

    const updateData: Record<string, unknown> = {
      status: body.status,
      statusHistory: history,
      updatedAt: new Date(),
    };
    if (body.trackingNumber) updateData.trackingNumber = body.trackingNumber;

    const [updated] = await db
      .update(ordersTable)
      .set(updateData)
      .where(eq(ordersTable.id, id))
      .returning();

    res.json(formatOrder(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update order status");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
