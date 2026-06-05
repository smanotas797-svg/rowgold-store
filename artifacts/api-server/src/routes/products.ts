import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { safeArray } from "../utils/safeArray";
import {
  CreateProductBody,
  UpdateProductBody,
  GetProductParams,
  UpdateProductParams,
  DeleteProductParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable);
    
    // Convertimos a array, y si llega un solo objeto o nada, creamos un array vacío
    const data = Array.isArray(products) ? products : (products ? [products] : []);

    const result = data.map((p: any) => ({
      id: p.id ?? 0,
      name: p.name ?? "Producto sin nombre",
      // Forzamos que sea siempre un número. Si no hay precio, ponemos 0.
      price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
      originalPrice: typeof p.originalPrice === 'number' ? p.originalPrice : parseFloat(p.originalPrice) || 0,
      rating: typeof p.rating === 'number' ? p.rating : parseFloat(p.rating) || 0,
      images: Array.isArray(p.images) ? p.images : [],
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    }));

    res.json(result);
  } catch (err) {
    // Si la base de datos falla, enviamos un array vacío.
    // Esto evita que el frontend rompa y muestre pantalla negra.
    res.json([]);
  }
});

    res.json(cleanProducts);
  } catch (err) {
    res.status(500).json([]);
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
        price: String(body.price),
        originalPrice: body.originalPrice ? String(body.originalPrice) : null,
        category: body.category,
        imageUrl: body.imageUrl,
        images: body.images ?? [],
        featured: body.featured ?? false,
        inStock: body.inStock ?? true,
        material: body.material,
        weight: body.weight,
        collection: body.collection,
      })
      .returning();

    res.status(201).json({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : null,
      rating: null,
      images: Array.isArray(product.images) ? product.images : [],
      createdAt: product.createdAt
        ? new Date(product.createdAt).toISOString()
        : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(400).json({ error: "Bad request" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse({ id: Number(req.params.id) });
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : null,
      rating: product.rating ? Number(product.rating) : null,
      images: Array.isArray(product.images) ? product.images : [],
      createdAt: product.createdAt
        ? new Date(product.createdAt).toISOString()
        : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(404).json({ error: "Not found" });
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse({ id: Number(req.params.id) });
    const body = UpdateProductBody.parse(req.body);

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice
        ? String(body.originalPrice)
        : null;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.material !== undefined) updateData.material = body.material;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.collection !== undefined) updateData.collection = body.collection;

    const [product] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : null,
      rating: product.rating ? Number(product.rating) : null,
      images: Array.isArray(product.images) ? product.images : [],
      createdAt: product.createdAt
        ? new Date(product.createdAt).toISOString()
        : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse({ id: Number(req.params.id) });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    const products = await db
      .select({ category: productsTable.category })
      .from(productsTable);

    const countMap: Record<string, number> = {};
    for (const p of products) {
      countMap[p.category] = (countMap[p.category] ?? 0) + 1;
    }

    res.json(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description ?? null,
        productCount: countMap[c.slug] ?? 0,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/catalog/featured", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.featured, true));

    const result = safeArray(products).map((p: any) => ({
      ...p,
      price: Number(p.price ?? 0),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: p.rating ? Number(p.rating) : null,
      images: Array.isArray(p.images) ? p.images : [],
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get featured products");

    res.status(500).json({
      error: "Internal server error",
    });
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
      byCategory: Object.entries(byCategory).map(([category, count]) => ({
        category,
        count,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get catalog stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
