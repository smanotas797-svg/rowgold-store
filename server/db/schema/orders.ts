import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ORDER_STATUSES = [
  "pending",
  "payment_confirmed",
  "preparing",
  "shipped",
  "in_transit",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ordersTable = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  status: text("status").default("pending").notNull(),
  items: text("items", { mode: "json" })
    .$type<Array<{ productId: number; productName: string; quantity: number; price: number; imageUrl?: string }>>()
    .notNull()
    .default([]),
  subtotal: real("subtotal").notNull(),
  shipping: real("shipping").default(0).notNull(),
  total: real("total").notNull(),
  shippingAddress: text("shipping_address"),
  paymentMethod: text("payment_method"),
  trackingNumber: text("tracking_number"),
  estimatedDelivery: text("estimated_delivery"),
  statusHistory: text("status_history", { mode: "json" })
    .$type<Array<{ status: string; timestamp: string; note?: string }>>()
    .notNull()
    .default([]),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
