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
      name: "Pulsera Eslabón Cubano ",
      description: "El clásico diseño cubano llevado al siguiente nivel de brillo. Esta pulsera de plata italiana cuenta con eslabones meticulosamente pavimentados con circonias de alta calidad y un broche de seguridad tipo cajón, una pieza imponente y con mucho estilo.",
      price: 495000,
      originalPrice: 530000,
      category: "pulseras",
      subcategory: "plata",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780113134/708536706_17870740644677507_5806512027029785331_n_qz7n9b.jpg",
      featured: true,
      inStock: true,
      stockQuantity: 15,
      material: "Plata Italiana 9.25 ",
      weight: "",
      collection: "ICONIC OF ROWGOLD",
      rating: 5.0,
      reviewCount: 45,
    },
  {
    name: "Pulsera Mariposa",
    description: "Pulsera para Dama con un hermoso dije central de mariposa, incluye cadena ajustable para adaptarse perfectamente a cualquier muñeca.",
    price: 55000,
    originalPrice: null,
    category: "pulseras",
    subcategory: "plata",
    imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780028172/707308402_17870738712677507_2338569982685114741_n_uyj1ze.jpg",
    featured: false,
    inStock: true,
    stockQuantity: 30,
    material: "Plata Italiana 925",
    weight: "",
    collection: "Clásica",
    rating: 4.7,
    reviewCount: 22
    },
    {
      name: "Collar de Tréboles Verdes",
      description: "Este diseño clásico intercala tréboles de cuatro hojas verdes",
      price: 145000,
      originalPrice: null,
      category: "cadenas",
      subcategory: "oro blanco",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780028172/707308402_17870738712677507_2338569982685114741_n_uyj1ze.jpg",
      featured: true,
      inStock: true,
      stockQuantity: 10,
      material: "Plata Italiana 925",
      weight: "28g",
      collection: "ICONIC OF ROWGOLD",
      rating: 5.0,
      reviewCount: 15,
    },
    {
      name: "Pulsera Rope Chain",
      description: "Pulsera clásica de cadena de cuerda en plata Italiana 925. Su diseño entrelazado captura la luz desde cualquier ángulo, aportando un brillo elegante",
      price: 80000,
      originalPrice: 100000,
      category: "pulseras",
      subcategory: "oro",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780093898/099FD742-D45A-4665-86B3-D62B19C23860_xfqbzy.jpg",
      featured: true,
      inStock: true,
      stockQuantity: 8,
      material: "Oro 18K",
      weight: "",
      collection: "ROWGOLD",
      rating: 5.0,
      reviewCount: 27,
    },
    {
      name: "Pulsera Eslabón Diamantada",
      description: "Pulsera Diamantada en plata Italiana 925 con un diseño moderno, plano y con mucha personalidad para destacar tu estilo.",
      price: 140000,
      originalPrice: 155000,
      category: "pulseras",
      subcategory: "diamantes",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780093922/78C47220-BDFB-42AC-A3E5-60A51E39AD5D_mcr1hr.jpg",
      featured: true,
      inStock: true,
      stockQuantity: 5,
      material: "Plata Italiana 9.25",
      weight: "12g",
      collection: "ROWGOLD",
      rating: 4.9,
      reviewCount: 41,
    },
    {
      name: "Cadena Bismark",
      description: "Diseño Unisex. Esta pulsera combina eslabones Cartier labrados en plata italiana con detalles en resina negra brillante, creando un contraste imponente y sofisticado.",
      price: 290000,
      originalPrice: null,
      category: "cadenas",
      subcategory: "compromiso",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780130299/IMG_3904_kxk6ka.jpg",
      images: ["https://res.cloudinary.com/dmlpiqian/image/upload/v1780130299/IMG_3904_kxk6ka.jpg"],
      featured: true,
      inStock: true,
      stockQuantity: 3,
      material: "Oro Laminado 18k",
      weight: "5g",
      collection: "ICONIC OF ROWGOLD",
      rating: 5.0,
      reviewCount: 63,
    },
    {
      name: "Anillo Meditation Ring",
      description: "Anillo eternidad con rubíes naturales y diamantes alternados en oro amarillo 18K. Símbolo de amor eterno y pasión.",
      price: 180000,
      originalPrice: null,
      category: "anillos",
      subcategory: "gemas",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780123973/IMG_3894_wmlead.jpg",
      images: ["https://res.cloudinary.com/dmlpiqian/image/upload/v1780123973/IMG_3894_wmlead.jpg"],
      featured: false,
      inStock: true,
      stockQuantity: 6,
      material: "Oro Laminado 18K",
      weight: "7g",
      collection: "ICONIC OF ROWGOLD",
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
      name: "Pulsera de Tréboles Verdes",
      description: "Esta Pulsera se destaca por sus icónicos Tréboles con sutiles verde y bordes texturizados. Una pieza en tendencia ideal para realzar cualquier look..",
      price: 125000,
      originalPrice: null,
      category: "pulseras",
      subcategory: "plata",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780128463/IMG_3905_svcnrf.jpg",
      images: ["https://res.cloudinary.com/dmlpiqian/image/upload/v1780128463/IMG_3905_svcnrf.jpg"],
      featured: true,
      inStock: true,
      stockQuantity: 7,
      material: "Plata Italiana 9.25",
      weight: "6g",
      collection: "ROWGOLD",
      rating: 4.9,
      reviewCount: 24,
    },
    {
      name: "Pulsera Eslabón Slim",
      description: "Esta tobillera en Plata 925 destaca por su icónico tejido de eslabón marino y diseñado para asentarse con total comodidad y destellar con elegancia en cada paso.",
      price: 70000,
      originalPrice: 95000,
      category: "pulseras",
      subcategory: "plata",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780130201/IMG_3906_a5b8gu.jpg",
      images: ["https://res.cloudinary.com/dmlpiqian/image/upload/v1780130201/IMG_3906_a5b8gu.jpg"],
      featured: false,
      inStock: true,
      stockQuantity: 4,
      material: "Plata Italiana 9.25",
      weight: "65g",
      collection: "Exclusiva",
      rating: 5.0,
      reviewCount: 12,
    },
    {
      name: "Cadena Rope Chain",
      description: "Tejido de cuerda que refleja luz con cada movimiento y se ve gruesa sin ser pesada.",
      price: 178000,
      originalPrice: null,
      category: "cadenas",
      subcategory: "Plata",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780124207/IMG_3886_dajndo.jpg",
      featured: true,
      inStock: true,
      stockQuantity: 12,
      material: "Plata Italiana 9.25",
      weight: "8g",
      collection: "ICONIC OF ROWGOLD",
      rating: 4.8,
      reviewCount: 45,
    },
    {
      name: "Anillo Trenzado",
      description: "Diseño grueso y trenzado que le  da un toque artesanal pero moderno. Pieza unica",
      price: 175000,
      originalPrice: 200000,
      category: "Anillos",
      subcategory: "Oro",
      imageUrl: "https://res.cloudinary.com/dmlpiqian/image/upload/v1780123973/IMG_3894_wmlead.jpg",
      featured: true,
      inStock: true,
      stockQuantity: 8,
      material: "Oro Laminado 18K",
      weight: "",
      collection: "ROWGOOLD",
      rating: 5.0,
      reviewCount: 27,
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
