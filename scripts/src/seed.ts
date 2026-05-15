import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding categories...");

  const cats = await db
    .insert(categoriesTable)
    .values([
      { name: "Joyas", slug: "joyas", description: "Anillos, collares, aretes y pulseras de lujo" },
      { name: "Relojes", slug: "relojes", description: "Relojes de alta gama y edicion limitada" },
      { name: "Accesorios", slug: "accesorios", description: "Billeteras, cinturones y accesorios premium" },
      { name: "Colecciones", slug: "colecciones", description: "Colecciones exclusivas y ediciones especiales" },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${cats.length} categories`);

  console.log("Seeding products...");

  const products = await db
    .insert(productsTable)
    .values([
      {
        name: "Anillo Eternidad Diamante",
        description: "Anillo de eternidad en oro blanco 18k con 2.5 quilates de diamantes VS1. Una pieza intemporal que simboliza el amor eterno.",
        price: "4850.00",
        originalPrice: "5800.00",
        category: "joyas",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85",
        featured: true,
        inStock: true,
        material: "Oro Blanco 18k, Diamantes VS1",
        weight: "6.2g",
        collection: "Eternidad",
        rating: "4.90",
        reviewCount: 47,
      },
      {
        name: "Collar Serpiente Oro",
        description: "Collar en cadena serpentina bañada en oro 24k. Diseño fluido y elegante para la mujer contemporánea.",
        price: "1290.00",
        category: "joyas",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=85",
        featured: true,
        inStock: true,
        material: "Oro 24k",
        weight: "12.8g",
        collection: "Serpentina",
        rating: "4.80",
        reviewCount: 89,
      },
      {
        name: "Aretes Gota Esmeralda",
        description: "Aretes colgantes con esmeraldas colombianas de 3 quilates cada una, engarzadas en platino.",
        price: "3200.00",
        originalPrice: "3900.00",
        category: "joyas",
        imageUrl: "https://images.unsplash.com/photo-1574534105359-1b5c4a47b5a1?w=600&q=85",
        featured: false,
        inStock: true,
        material: "Platino, Esmeraldas Colombianas",
        weight: "4.1g",
        collection: "Gemas",
        rating: "4.95",
        reviewCount: 23,
      },
      {
        name: "Pulsera Diamantes Floating",
        description: "Pulsera tennis con 48 diamantes flotantes en engaste invisible. El epítome de la elegancia.",
        price: "7600.00",
        category: "joyas",
        imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85",
        featured: true,
        inStock: true,
        material: "Oro Amarillo 18k, Diamantes F-VS2",
        weight: "8.9g",
        collection: "Floating",
        rating: "5.00",
        reviewCount: 15,
      },
      {
        name: "Reloj Royal Oak Chronograph",
        description: "Reloj cronógrafo de acero inoxidable con movimiento automático suizo. Caja de 41mm con bisel octogonal icónico.",
        price: "12500.00",
        category: "relojes",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85",
        featured: true,
        inStock: true,
        material: "Acero 316L, Cristal de Zafiro",
        weight: "175g",
        collection: "Royal Oak",
        rating: "4.85",
        reviewCount: 62,
      },
      {
        name: "Reloj Skeleton Tourbillon",
        description: "Reloj esqueleto con tourbillon volante visible. Solo 50 piezas en el mundo. Una obra maestra mecánica.",
        price: "28900.00",
        category: "relojes",
        imageUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600&q=85",
        featured: true,
        inStock: true,
        material: "Titanio Grade 5, Cristal de Zafiro",
        weight: "112g",
        collection: "Tourbillon",
        rating: "5.00",
        reviewCount: 8,
      },
      {
        name: "Reloj Dama Diamantes",
        description: "Reloj de dama con 96 diamantes pavé en bisel y correa de cuero cocodrilo auténtico.",
        price: "8750.00",
        originalPrice: "10200.00",
        category: "relojes",
        imageUrl: "https://images.unsplash.com/photo-1617170017ede-c6f5f2d3db07?w=600&q=85",
        featured: false,
        inStock: true,
        material: "Oro Rosa 18k, Diamantes, Cuero Cocodrilo",
        weight: "68g",
        collection: "Dame Luxe",
        rating: "4.75",
        reviewCount: 31,
      },
      {
        name: "Cartera Piel Italiana Premium",
        description: "Cartera bifold en piel de becerro italiana. 8 ranuras para tarjetas, 2 compartimentos para billetes.",
        price: "485.00",
        category: "accesorios",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594785?w=600&q=85",
        featured: false,
        inStock: true,
        material: "Piel de Becerro Italiana",
        weight: "85g",
        collection: "Everyday Luxury",
        rating: "4.70",
        reviewCount: 154,
      },
      {
        name: "Cinturon Hermes Style",
        description: "Cinturón reversible negro/café con hebilla dorada grabada. Ajustable de 80 a 110cm.",
        price: "650.00",
        category: "accesorios",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=85",
        featured: false,
        inStock: true,
        material: "Piel Genuina, Hebilla Dorada 24k",
        weight: "250g",
        collection: "Everyday Luxury",
        rating: "4.60",
        reviewCount: 78,
      },
      {
        name: "Gafas Sol Gold Frame",
        description: "Gafas de sol con montura dorada y lentes polarizados anti-UV. Estuche de cuero incluido.",
        price: "390.00",
        originalPrice: "490.00",
        category: "accesorios",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=85",
        featured: false,
        inStock: true,
        material: "Marco Dorado, Lentes Polarizados",
        weight: "32g",
        collection: "Sun Luxe",
        rating: "4.55",
        reviewCount: 203,
      },
      {
        name: "Set Joyas Noche Estrellada",
        description: "Set completo: collar, aretes y anillo con zafiros azules y diamantes blancos. Presentación en caja de madera.",
        price: "5800.00",
        category: "colecciones",
        imageUrl: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=85",
        featured: true,
        inStock: true,
        material: "Oro Blanco 18k, Zafiros, Diamantes",
        collection: "Noche Estrellada",
        rating: "4.92",
        reviewCount: 19,
      },
      {
        name: "Anillo Solitario Princess Cut",
        description: "Anillo solitario con diamante corte princess de 2 quilates D-VVS2. Ideal para compromiso.",
        price: "9200.00",
        category: "joyas",
        imageUrl: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600&q=85",
        featured: false,
        inStock: true,
        material: "Platino 950, Diamante D-VVS2",
        weight: "4.8g",
        collection: "Solitarios",
        rating: "4.98",
        reviewCount: 34,
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${products.length} products`);
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
