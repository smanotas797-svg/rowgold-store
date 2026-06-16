import { pgTable, text, serial, numeric, integer, timestamp, json } from "drizzle-orm/pg-core";
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

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  status: text("status", { enum: ORDER_STATUSES }).default("pending").notNull(),
  items: json("items")
    .$type<Array<{ productId: number; productName: string; quantity: number; price: number; imageUrl?: string }>>()
    .default([]),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  paymentMethod: text("payment_method"),
  trackingNumber: text("tracking_number"),
  estimatedDelivery: text("estimated_delivery"),
  statusHistory: json("status_history")
    .$type<Array<{ status: string; timestamp: string; note?: string }>>()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
