import { Router } from "express";
import { db, cartItemsTable, productsTable } from "../db/index.js";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const AddToCartBody = z.object({ productId: z.number().int().positive(), quantity: z.number().int().min(1) });
const UpdateCartItemBody = z.object({ quantity: z.number().int().min(0) });
const ProductIdParam = z.object({ productId: z.number().int().positive() });

function getSessionId(req: import("express").Request): string {
  return (req.headers["x-session-id"] as string | undefined) ?? "default-session";
}

async function buildCart(sessionId: string) {
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
  const cartItems = [];
  let subtotal = 0;
  for (const item of items) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    if (!product) continue;
    const price = Number(product.price);
    subtotal += price * item.quantity;
    cartItems.push({
      productId: item.productId,
      quantity: item.quantity,
      product: {
        ...product,
        price,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        rating: product.rating ? Number(product.rating) : null,
        images: Array.isArray(product.images) ? product.images : [],
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : null,
      },
    });
  }
  const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 25 : 0;
  return { items: cartItems, subtotal, shipping, total: subtotal + shipping, itemCount: cartItems.reduce((s, i) => s + i.quantity, 0) };
}

router.get("/cart", async (req, res) => {
  try {
    res.json(await buildCart(getSessionId(req)));
  } catch (err) {
    req.log.error({ err }, "Failed to get cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart/items", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const body = AddToCartBody.parse(req.body);
    const [existing] = await db.select().from(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, body.productId)));
    if (existing) {
      await db.update(cartItemsTable).set({ quantity: existing.quantity + body.quantity }).where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({ sessionId, productId: body.productId, quantity: body.quantity });
    }
    res.json(await buildCart(sessionId));
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(400).json({ error: "Bad request" });
  }
});

router.patch("/cart/items/:productId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = ProductIdParam.parse({ productId: Number(req.params.productId) });
    const body = UpdateCartItemBody.parse(req.body);
    if (body.quantity <= 0) {
      await db.delete(cartItemsTable).where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
    } else {
      await db.update(cartItemsTable).set({ quantity: body.quantity })
        .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
    }
    res.json(await buildCart(sessionId));
  } catch (err) {
    req.log.error({ err }, "Failed to update cart item");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/cart/items/:productId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = ProductIdParam.parse({ productId: Number(req.params.productId) });
    await db.delete(cartItemsTable).where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
    res.json(await buildCart(sessionId));
  } catch (err) {
    req.log.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/clear", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
    res.json(await buildCart(sessionId));
  } catch (err) {
    req.log.error({ err }, "Failed to clear cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
