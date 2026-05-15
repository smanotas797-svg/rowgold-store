import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CartItem = typeof cartItemsTable.$inferSelect;
