import { Router } from "express";
import { db, productsTable, categoriesTable } from "../db/index.js";
import { eq } from "drizzle-orm";
import { safeArray } from "../utils/safeArray.js";
import { z } from "zod";

const router = Router();

const CreateProductBody = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number(),
  originalPrice: z.number().optional().nullable(),
  category: z.string(),
  subcategory: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  inStock: z.boolean().optional(),
  material: z.string().optional().nullable(),
  weight: z.string().optional().nullable(),
  collection: z.string().optional().nullable(),
});

const UpdateProductBody = CreateProductBody.partial();
const IdParam = z.object({ id: z.number().int().positive() });

function formatProduct(p: typeof productsTable.$inferSelect) {
  return {
    ...p,
    price: p.price ?? 0,
    originalPrice: p.originalPrice ?? null,
    rating: p.rating ?? null,
    images: Array.isArray(p.images) ? p.images : [],
    createdAt: p.createdAt ?? new Date().toISOString(),
  };
}

router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    res.json(safeArray(products).map(formatProduct));
  } catch {
    res.json([]);
  }
});

router.post("/products", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db
      .insert(productsTable)
      .values({
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice ?? null,
        category: body.category,
        subcategory: body.subcategory,
        imageUrl: body.imageUrl,
        images: body.images ?? [],
        featured: body.featured ?? false,
        inStock: body.inStock ?? true,
        material: body.material,
        weight: body.weight,
        collection: body.collection,
      })
      .returning();
    res.status(201).json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(400).json({ error: "Solicitud inválida" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: Number(req.params.id) });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(404).json({ error: "No encontrado" });
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: Number(req.params.id) });
    const body = UpdateProductBody.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.material !== undefined) updateData.material = body.material;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.collection !== undefined) updateData.collection = body.collection;
    const [product] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, id)).returning();
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(formatProduct(product));
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(400).json({ error: "Solicitud inválida" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = IdParam.parse({ id: Number(req.params.id) });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    const products = await db.select({ category: productsTable.category }).from(productsTable);
    const countMap: Record<string, number> = {};
    for (const p of products) {
      countMap[p.category] = (countMap[p.category] ?? 0) + 1;
    }
    res.json(categories.map((c) => ({
      id: c.id, name: c.name, slug: c.slug, description: c.description ?? null, productCount: countMap[c.slug] ?? 0,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/catalog/featured", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.featured, true));
    res.json(safeArray(products).map(formatProduct));
  } catch (err) {
    req.log.error({ err }, "Failed to get featured products");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/catalog/stats", async (req, res) => {
  try {
    const allProducts = await db.select().from(productsTable);
    const allCategories = await db.select().from(categoriesTable);
    const byCategory: Record<string, number> = {};
    for (const p of allProducts) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    }
    res.json({
      totalProducts: allProducts.length,
      totalCategories: allCategories.length,
      featuredCount: allProducts.filter((p) => p.featured).length,
      byCategory: Object.entries(byCategory).map(([category, count]) => ({ category, count })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get catalog stats");
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
