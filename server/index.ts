import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import { db, productsTable, categoriesTable } from "./db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = Number(process.env.PORT ?? 3000);
const isProduction = process.env.NODE_ENV === "production";

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (isProduction) {
  const publicDir = join(__dirname, "public");
  if (existsSync(publicDir)) {
    app.use(express.static(publicDir));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(join(publicDir, "index.html"));
    });
  }
}

async function seedDatabase() {
  const existing = await db.select().from(productsTable).limit(1);
  if (existing.length > 0) return;

  logger.info("Sembrando catálogo inicial en SQLite...");

  await db.insert(categoriesTable).values([
    { name: "Cadenas", slug: "cadenas", description: "Cadenas de oro y plata de alta calidad" },
    { name: "Pulseras", slug: "pulseras", description: "Pulseras para todas las ocasiones" },
    { name: "Anillos", slug: "anillos", description: "Anillos de lujo y compromiso" },
    { name: "Aretes", slug: "aretes", description: "Aretes elegantes y exclusivos" },
    { name: "Collares", slug: "collares", description: "Collares únicos y lujosos" },
    { name: "Relojes", slug: "relojes", description: "Relojes de lujo y precisión" },
  ]);

  await db.insert(productsTable).values([
    {
      name: "Cadena ",
      description: "Cadena cubana de oro 18 quilates con acabado brillante. Eslabones sólidos de 5mm de ancho. La pieza favorita de los coleccionistas.",
      price: 1850,
      originalPrice: 2200,
      category: "cadenas",
      subcategory: "oro",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780130299/IMG_3904_kxk6ka.jpg",
      images: ["https://res.cloudinary.com/dmlpiqian/image/upload/v1780130299/IMG_3904_kxk6ka.jpg"],
      featured: true,
      inStock: true,
      stockQuantity: 15,
      material: "Oro ",
      weight: "42g",
      collection: "Clásica",
      rating: 4.9,
      reviewCount: 38,
    },
    {
      name: "Cadena Figaro Plata 925",
      description: "Cadena Figaro en plata esterlina 925 con baño de rodio. Diseño alternado clásico de 4mm. Perfecta para colgar medallas o dijes.",
      price: 380,
      originalPrice: 450,
      category: "cadenas",
      subcategory: "plata",
      imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop"],
      featured: false,
      inStock: true,
      stockQuantity: 30,
      material: "Plata 925",
      weight: "18g",
      collection: "Clásica",
      rating: 4.7,
      reviewCount: 22,
    },
    {
      name: "Cadena Rope Oro Blanco 14K",
      description: "Cadena rope trenzada en oro blanco 14 quilates. Elegancia moderna con destellos únicos. Espesor de 3mm, longitud 50cm.",
      price: 1290,
      originalPrice: null,
      category: "cadenas",
      subcategory: "oro blanco",
      imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94522ec?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1573408301185-9519f94522ec?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 10,
      material: "Oro Blanco 14K",
      weight: "28g",
      collection: "Moderna",
      rating: 4.8,
      reviewCount: 15,
    },
    {
      name: "Pulsera Esclava Oro 18K",
      description: "Pulsera esclava sólida en oro 18 quilates. Cierre de seguridad con bisagra invisible. Acabado pulido de alta calidad.",
      price: 2100,
      originalPrice: 2500,
      category: "pulseras",
      subcategory: "oro",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 8,
      material: "Oro 18K",
      weight: "35g",
      collection: "Premium",
      rating: 5.0,
      reviewCount: 27,
    },
    {
      name: "Pulsera Diamantes 0.50ct",
      description: "Delicada pulsera de tenis con 0.50 quilates de diamantes naturales en oro blanco 18K. Claridad VS2, color G.",
      price: 3800,
      originalPrice: 4500,
      category: "pulseras",
      subcategory: "diamantes",
      imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 5,
      material: "Oro Blanco 18K + Diamantes",
      weight: "12g",
      collection: "Exclusiva",
      rating: 4.9,
      reviewCount: 41,
    },
    {
      name: "Anillo Solitario Diamante 1ct",
      description: "El clásico anillo solitario con diamante de 1 quilate, corte brillante, montura de 4 uñas en platino. Certificado GIA.",
      price: 8500,
      originalPrice: null,
      category: "anillos",
      subcategory: "compromiso",
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 3,
      material: "Platino + Diamante GIA",
      weight: "5g",
      collection: "Eternidad",
      rating: 5.0,
      reviewCount: 63,
    },
    {
      name: "Anillo Eternidad Rubíes",
      description: "Anillo eternidad con rubíes naturales y diamantes alternados en oro amarillo 18K. Símbolo de amor eterno y pasión.",
      price: 4200,
      originalPrice: 4900,
      category: "anillos",
      subcategory: "gemas",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop"],
      featured: false,
      inStock: true,
      stockQuantity: 6,
      material: "Oro 18K + Rubíes + Diamantes",
      weight: "7g",
      collection: "Exclusiva",
      rating: 4.8,
      reviewCount: 19,
    },
    {
      name: "Aretes Perlas Akoya",
      description: "Aretes de perlas Akoya japonesas 7-7.5mm en montura de oro blanco 18K. Brillo excepcional, lustre satinado natural.",
      price: 680,
      originalPrice: 820,
      category: "aretes",
      subcategory: "perlas",
      imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=600&auto=format&fit=crop"],
      featured: false,
      inStock: true,
      stockQuantity: 20,
      material: "Perla Akoya + Oro 18K",
      weight: "4g",
      collection: "Elegancia",
      rating: 4.7,
      reviewCount: 33,
    },
    {
      name: "Aretes Diamantes Gota",
      description: "Elegantes aretes en forma de gota con diamantes en pavé. Oro blanco 18K con cierre de presión seguro.",
      price: 2950,
      originalPrice: null,
      category: "aretes",
      subcategory: "diamantes",
      imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 7,
      material: "Oro Blanco 18K + Diamantes",
      weight: "6g",
      collection: "Moderna",
      rating: 4.9,
      reviewCount: 24,
    },
    {
      name: "Collar Perlas del Sur",
      description: "Collar de perlas del Mar del Sur de 11-13mm. Cada perla seleccionada a mano por su excepcional brillo. Con broche de oro.",
      price: 5600,
      originalPrice: 6800,
      category: "collares",
      subcategory: "perlas",
      imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop"],
      featured: false,
      inStock: true,
      stockQuantity: 4,
      material: "Perlas del Mar del Sur + Oro",
      weight: "65g",
      collection: "Exclusiva",
      rating: 5.0,
      reviewCount: 12,
    },
    {
      name: "Collar Diamante Solitario",
      description: "Colgante de diamante 0.30ct corte brillante en cadena de oro blanco 18K de 45cm. Elegancia atemporal.",
      price: 1980,
      originalPrice: 2350,
      category: "collares",
      subcategory: "diamantes",
      imageUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 12,
      material: "Oro Blanco 18K + Diamante",
      weight: "8g",
      collection: "Clásica",
      rating: 4.8,
      reviewCount: 45,
    },
    {
      name: "Reloj Royal Prestige Oro",
      description: "Reloj de lujo suizo con caja de oro 18K, esfera de nácar y correa de cocodrilo. Movimiento automático. Garantía 5 años.",
      price: 12500,
      originalPrice: 15000,
      category: "relojes",
      subcategory: "automatico",
      imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop"],
      featured: true,
      inStock: true,
      stockQuantity: 3,
      material: "Oro 18K + Nácar + Cocodrilo",
      weight: "185g",
      collection: "Royal",
      rating: 5.0,
      reviewCount: 8,
    },
  ]);

  logger.info("Base de datos sembrada: 12 productos y 6 categorías creados");
}

async function main() {
  try {
    await seedDatabase();
  } catch (err) {
    logger.error({ err }, "Error al sembrar la base de datos");
  }

  app.listen(port, "0.0.0.0", () => {
    logger.info({ port, mode: process.env.NODE_ENV ?? "development" }, "ROWGOLD server listening");
  });
}

main();

export default app;
