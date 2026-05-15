import { pgTable, text, serial, numeric, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  status: text("status", { enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"] }).default("pending").notNull(),
  items: json("items").$type<Array<{ productId: number; productName: string; quantity: number; price: number }>>().default([]),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
