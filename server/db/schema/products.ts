import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  imageUrl: text("image_url"),
  images: text("images", { mode: "json" }).$type<string[]>().default([]),
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
  inStock: integer("in_stock", { mode: "boolean" }).default(true).notNull(),
  stockQuantity: integer("stock_quantity").default(0),
  material: text("material"),
  weight: text("weight"),
  collection: text("collection"),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`).notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
