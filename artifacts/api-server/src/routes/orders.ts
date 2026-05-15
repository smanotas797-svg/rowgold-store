import { Router } from "express";
import { db, ordersTable, cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";

const router = Router();

function getSessionId(req: import("express").Request): string {
  return (req.headers["x-session-id"] as string | undefined) ?? "default-session";
}

router.get("/orders", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(
      orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        shipping: Number(o.shipping ?? 0),
        total: Number(o.total),
        items: (o.items as unknown[]) ?? [],
        createdAt: o.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

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
      });
    }

    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + shipping;

    const [order] = await db
      .insert(ordersTable)
      .values({
        status: "pending",
        items: orderItems,
        subtotal: String(subtotal),
        shipping: String(shipping),
        total: String(total),
        shippingAddress: body.shippingAddress,
        paymentMethod: body.paymentMethod,
      })
      .returning();

    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

    res.status(201).json({
      ...order,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping ?? 0),
      total: Number(order.total),
      items: (order.items as unknown[]) ?? [],
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create order");
    res.status(400).json({ error: "Bad request" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = GetOrderParams.parse({ id: Number(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({
      ...order,
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping ?? 0),
      total: Number(order.total),
      items: (order.items as unknown[]) ?? [],
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(404).json({ error: "Not found" });
  }
});

export default router;
