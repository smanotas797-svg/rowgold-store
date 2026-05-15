import { pgTable, text, serial, numeric, boolean, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  images: json("images").$type<string[]>().default([]),
  featured: boolean("featured").default(false).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  material: text("material"),
  weight: text("weight"),
  collection: text("collection"),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
export type Category = typeof categoriesTable.$inferSelect;
