import { Router } from "express";
import { db, reviewsTable, productsTable } from "@workspace/db";
import { eq, avg, count, sql } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

const ReviewInputSchema = z.object({
  authorName: z.string().min(1),
  authorEmail: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(3),
});

function formatReview(r: typeof reviewsTable.$inferSelect) {
  return {
    id: r.id,
    productId: r.productId,
    authorName: r.authorName,
    authorEmail: r.authorEmail ?? null,
    rating: r.rating,
    title: r.title ?? null,
    body: r.body,
    verified: r.verified === 1,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/products/:id/reviews", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId))
      .orderBy(sql`${reviewsTable.createdAt} DESC`);

    res.json(reviews.map(formatReview));
  } catch (err) {
    req.log.error({ err }, "Failed to list reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products/:id/reviews", async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    const body = ReviewInputSchema.parse(req.body);

    const [review] = await db
      .insert(reviewsTable)
      .values({
        productId,
        authorName: body.authorName,
        authorEmail: body.authorEmail ?? null,
        rating: body.rating,
        title: body.title ?? null,
        body: body.body,
        verified: 0,
      })
      .returning();

    // Recalculate and update product rating
    const stats = await db
      .select({
        avgRating: avg(reviewsTable.rating),
        totalCount: count(reviewsTable.id),
      })
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, productId));

    if (stats[0]) {
      await db
        .update(productsTable)
        .set({
          rating: String(Number(stats[0].avgRating).toFixed(2)),
          reviewCount: Number(stats[0].totalCount),
        })
        .where(eq(productsTable.id, productId));
    }

    res.status(201).json(formatReview(review));
  } catch (err) {
    req.log.error({ err }, "Failed to create review");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
