import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star, Shield, Truck, Award, Gem } from "lucide-react";
import { useGetFeaturedProducts, useListCategories, useListProducts } from "@workspace/api-client-react";

const GOLD = "#d4af37";

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function HeroSection() {
  const { data: jewelryProducts } = useListProducts({ category: "joyas", featured: true });
  const hero = jewelryProducts?.[0] ?? null;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #040404 0%, #0c0900 45%, #060606 100%)",
      }}
    >
      {/* Cinematic gradient layers */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 90% 70% at 60% 40%, rgba(212,175,55,0.06) 0%, transparent 65%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 80% at 15% 80%, rgba(180,120,0,0.04) 0%, transparent 60%)",
      }} />

      {/* Floating particles */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = 3 + Math.random() * 94;
        const y = Math.random() * 100;
        const size = Math.random() * 1.8 + 0.6;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              background: GOLD,
              boxShadow: `0 0 ${size * 3}px rgba(212,175,55,0.9)`,
              opacity: Math.random() * 0.45 + 0.1,
            }}
            animate={{
              y: [0, -(18 + Math.random() * 30), 0],
              opacity: [0.1, Math.random() * 0.6 + 0.2, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Horizontal light line */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{
        top: "30%",
        height: 1,
        background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.06) 30%, rgba(212,175,55,0.12) 50%, rgba(212,175,55,0.06) 70%, transparent 100%)",
      }} />

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-14 lg:gap-20 pt-20 pb-12">

        {/* Left: text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3 justify-center lg:justify-start mb-7"
          >
            <div style={{ height: 1, width: 28, background: "rgba(212,175,55,0.4)" }} />
            <p className="text-[10px] tracking-[0.45em] uppercase" style={{ color: "rgba(212,175,55,0.6)" }}>
              Colección 2024
            </p>
            <div style={{ height: 1, width: 28, background: "rgba(212,175,55,0.4)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 1.07,
              letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            Luxury{" "}
            <span className="gold-shimmer" style={{ display: "inline-block" }}>
              Without
            </span>
            <br />
            Limits
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="w-20 my-7 lg:mx-0 mx-auto"
            style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.8), rgba(212,175,55,0.2))", transformOrigin: "left" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-sm mb-10 max-w-sm mx-auto lg:mx-0"
            style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", lineHeight: 1.7 }}
          >
            Joyería fina &bull; Relojes &bull; Accesorios de lujo
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <Link href="/catalog">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(212,175,55,0.25)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3 px-9 py-3.5 uppercase font-medium"
                style={{
                  background: "linear-gradient(135deg, #9a7808, #d4af37, #f0cc50, #d4af37, #9a7808)",
                  color: "#050505",
                  letterSpacing: "0.2em",
                  fontSize: "0.65rem",
                  transition: "all 0.3s ease",
                }}
              >
                Explorar Colección
                <ArrowRight size={13} />
              </motion.button>
            </Link>
            <Link href="/catalog?category=joyas">
              <motion.button
                whileHover={{ scale: 1.04, borderColor: "rgba(212,175,55,0.6)", color: GOLD }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3 px-9 py-3.5 uppercase transition-all"
                style={{
                  border: "1px solid rgba(212,175,55,0.22)",
                  color: "rgba(212,175,55,0.6)",
                  letterSpacing: "0.2em",
                  fontSize: "0.65rem",
                  background: "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                Ver Joyas
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right: best jewelry card */}
        {hero && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto shrink-0"
            style={{ maxWidth: 320 }}
          >
            <Link href={`/product/${hero.id}`}>
              <motion.div
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group cursor-pointer relative"
              >
                {/* Outer glow */}
                <div className="absolute -inset-6 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)", filter: "blur(20px)" }} />

                <div className="relative overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(255,255,255,0.015)", backdropFilter: "blur(6px)" }}>
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                    {hero.imageUrl ? (
                      <motion.img
                        src={hero.imageUrl}
                        alt={hero.name}
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(0.85) contrast(1.1) saturate(0.95)" }}
                        whileHover={{ scale: 1.07 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "#111" }}>
                        <Gem size={48} style={{ color: "rgba(212,175,55,0.1)" }} />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                    }} />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 text-[9px] tracking-[0.22em] uppercase"
                      style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(212,175,55,0.45)", color: GOLD, backdropFilter: "blur(8px)" }}>
                      Mejor Joya
                    </div>

                    {/* Hover view CTA */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center pointer-events-none"
                      style={{ background: "rgba(0,0,0,0.3)" }}>
                      <span className="text-[10px] tracking-[0.3em] uppercase px-6 py-3"
                        style={{ border: "1px solid rgba(212,175,55,0.65)", color: GOLD, backdropFilter: "blur(4px)" }}>
                        Ver Pieza
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-5 py-4" style={{ background: "rgba(0,0,0,0.65)" }}>
                    {hero.collection && (
                      <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(212,175,55,0.4)" }}>{hero.collection}</p>
                    )}
                    <p className="mb-3 leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}>
                      {hero.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 500, color: GOLD }}>
                        ${hero.price.toLocaleString()}
                      </span>
                      {hero.rating != null && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={10} fill={i < Math.round(hero.rating!) ? GOLD : "transparent"} color={GOLD} />
                          ))}
                          <span className="text-xs ml-1" style={{ color: "rgba(212,175,55,0.5)" }}>{Number(hero.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] tracking-[0.4em] uppercase" style={{ color: "rgba(212,175,55,0.35)" }}>Scroll</span>
        <motion.div
          style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(212,175,55,0.4), transparent)" }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number | null;
    category: string;
    imageUrl?: string | null;
    rating?: number | null;
    collection?: string | null;
  };
  index: number;
  inView: boolean;
}

export function ProductCard({ product, index, inView }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09 }}
      className="group cursor-pointer"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`}>
        <div className="luxury-card overflow-hidden transition-all duration-500 hover:border-gold relative"
          style={{ borderRadius: "1px" }}>

          {/* Image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "linear-gradient(135deg, #0e0e0e, #181500)" }}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                style={{ filter: "brightness(0.88) contrast(1.08)", transition: "transform 0.7s ease, filter 0.5s ease" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0e0e0e, #1a1500)" }}>
                <Gem size={36} style={{ color: "rgba(212,175,55,0.1)" }} />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: "rgba(0,0,0,0.38)" }}>
              <span className="text-[10px] tracking-[0.3em] uppercase px-5 py-2.5"
                style={{ border: "1px solid rgba(212,175,55,0.6)", color: GOLD, backdropFilter: "blur(4px)" }}>
                Ver Pieza
              </span>
            </div>

            {/* Collection tag */}
            {product.collection && (
              <div className="absolute top-3 left-3 px-2.5 py-0.5 text-[8px] tracking-widest uppercase"
                style={{ background: "rgba(0,0,0,0.75)", border: "1px solid rgba(212,175,55,0.28)", color: "rgba(212,175,55,0.75)", backdropFilter: "blur(6px)" }}>
                {product.collection}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "rgba(212,175,55,0.45)" }}>
              {product.category}
            </p>
            <h3 className="mb-3 leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.08rem", fontWeight: 400, color: "rgba(255,255,255,0.88)", letterSpacing: "0.04em" }}>
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 500, color: GOLD }}>
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through" style={{ color: "rgba(255,255,255,0.18)" }}>
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star size={10} fill={GOLD} color={GOLD} />
                  <span className="text-xs" style={{ color: "rgba(212,175,55,0.55)" }}>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, inView }: { eyebrow: string; title: string; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center mb-14"
    >
      <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "rgba(212,175,55,0.65)" }}>{eyebrow}</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", fontWeight: 300, color: "rgba(255,255,255,0.95)", letterSpacing: "0.06em" }}>
        {title}
      </h2>
      <div className="w-14 mx-auto mt-5" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)" }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   FEATURED PRODUCTS
───────────────────────────────────────────── */
function FeaturedProducts() {
  const { data: products, isLoading } = useGetFeaturedProducts();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader eyebrow="Selección Exclusiva" title="Piezas Destacadas" inView={inView} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="luxury-card aspect-[3/4] rounded-sm animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(products ?? []).slice(0, 6).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} inView={inView} />
          ))}
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }} className="text-center mt-14">
        <Link href="/catalog">
          <motion.button
            whileHover={{ scale: 1.03, borderColor: "rgba(212,175,55,0.5)", color: GOLD }}
            className="text-[11px] tracking-[0.25em] uppercase px-10 py-3.5 transition-all"
            style={{ border: "1px solid rgba(212,175,55,0.22)", color: "rgba(212,175,55,0.6)" }}
          >
            Ver Todo el Catálogo
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   JEWELRY CATEGORY SECTIONS
   Cadenas · Pulseras · Aretes · Anillos · Relojes
───────────────────────────────────────────── */
const JEWELRY_SECTIONS = [
  {
    key: "anillos",
    title: "Anillos",
    eyebrow: "Colección",
    description: "Piezas eternas que simbolizan los momentos más importantes de tu vida.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=85",
    href: "/catalog?category=joyas&sub=anillos",
  },
  {
    key: "cadenas",
    title: "Cadenas",
    eyebrow: "Oro & Plata",
    description: "Cadenas artesanales de oro 18k y plata 925 con acabado espejo.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=85",
    href: "/catalog?category=joyas&sub=cadenas",
  },
  {
    key: "pulseras",
    title: "Pulseras",
    eyebrow: "Elegancia",
    description: "Diseños que abrazan tu muñeca con la elegancia que mereces.",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=900&q=85",
    href: "/catalog?category=joyas&sub=pulseras",
  },
  {
    key: "aretes",
    title: "Aretes",
    eyebrow: "Brillo",
    description: "Desde argollas minimalistas hasta statement earrings con diamantes.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=85",
    href: "/catalog?category=joyas&sub=aretes",
  },
  {
    key: "relojes",
    title: "Relojes",
    eyebrow: "Alta Relojería",
    description: "Relojes de lujo que miden el tiempo con precisión suiza.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=85",
    href: "/catalog?category=relojes",
  },
];

function JewelryCategoryCard({
  section,
  index,
  inView,
  reversed,
}: {
  section: typeof JEWELRY_SECTIONS[number];
  index: number;
  inView: boolean;
  reversed: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08 }}
      className="group relative overflow-hidden cursor-pointer"
      style={{ border: "1px solid rgba(212,175,55,0.1)" }}
    >
      <Link href={section.href}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
          {/* Image */}
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-108"
            style={{ filter: "brightness(0.55) contrast(1.12) saturate(0.85)", transition: "transform 0.8s ease, filter 0.5s ease" }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)",
            transition: "opacity 0.5s ease",
          }} />

          {/* Gold glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,175,55,0.12) 0%, transparent 70%)" }} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-7">
            <motion.p
              className="text-[9px] tracking-[0.35em] uppercase mb-2"
              style={{ color: "rgba(212,175,55,0.55)" }}
            >
              {section.eyebrow}
            </motion.p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.08em",
              lineHeight: 1.1,
              marginBottom: "0.6rem",
            }}>
              {section.title}
            </h3>
            <p className="text-xs leading-relaxed mb-5 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
              {section.description}
            </p>
            <div className="flex items-center gap-2">
              <div style={{ height: 1, width: 0, background: GOLD, transition: "width 0.4s ease" }}
                className="group-hover:w-6" />
              <span className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 group-hover:text-amber-400"
                style={{ color: "rgba(212,175,55,0.5)" }}>
                Explorar
              </span>
              <ArrowRight size={11} style={{ color: "rgba(212,175,55,0.5)", transition: "transform 0.3s ease, color 0.3s ease" }}
                className="group-hover:text-amber-400 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function JewelrySections() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 px-6 lg:px-8"
      style={{ background: "linear-gradient(180deg, #060606 0%, #090700 50%, #060606 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Nuestra Joyería" title="Colecciones Premium" inView={inView} />

        {/* 5-column responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {JEWELRY_SECTIONS.map((section, i) => (
            <JewelryCategoryCard
              key={section.key}
              section={section}
              index={i}
              inView={inView}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CATEGORY GRID
───────────────────────────────────────────── */
function CategoryGrid() {
  const { data: categories } = useListCategories();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const categoryImages: Record<string, string> = {
    joyas: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85",
    relojes: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=85",
    accesorios: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85",
    colecciones: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&q=85",
  };

  return (
    <section ref={ref} className="py-24 px-6 lg:px-8" style={{ background: "linear-gradient(180deg, #0a0900 0%, #060606 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Explorar" title="Nuestras Categorías" inView={inView} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(categories ?? []).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group cursor-pointer"
              data-testid={`card-category-${cat.id}`}
            >
              <Link href={`/catalog?category=${cat.slug}`}>
                <div className="relative overflow-hidden luxury-card transition-all duration-500" style={{ aspectRatio: "3/4", borderRadius: "1px" }}>
                  <img
                    src={categoryImages[cat.slug] ?? categoryImages.joyas}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "brightness(0.48) contrast(1.12)" }}
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
                  }} />
                  {/* Gold border on hover */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-gold-dim transition-all duration-500" />

                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-7 px-4 text-center">
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.95)",
                      letterSpacing: "0.08em",
                    }}>
                      {cat.name}
                    </h3>
                    <p className="text-[10px] mt-1.5 tracking-[0.2em]" style={{ color: "rgba(212,175,55,0.55)" }}>
                      {cat.productCount} piezas
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRUST BADGES
───────────────────────────────────────────── */
function TrustBadges() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const badges = [
    { icon: Shield, title: "Garantía Vitalicia", desc: "Certificado de autenticidad incluido" },
    { icon: Truck, title: "Envío Gratis", desc: "En compras mayores a $500" },
    { icon: Award, title: "Materiales Premium", desc: "Oro 18k, platino y diamantes" },
    { icon: Star, title: "5 Estrellas", desc: "Miles de clientes satisfechos" },
  ];

  return (
    <section ref={ref} className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="w-full mb-14" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)" }} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
              data-testid={`badge-trust-${i}`}
            >
              <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.04)", boxShadow: "0 0 0 rgba(212,175,55,0)" }}
              >
                <b.icon size={22} style={{ color: GOLD, opacity: 0.75 }} />
              </div>
              <h4 className="text-sm mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "rgba(255,255,255,0.82)", letterSpacing: "0.06em" }}>
                {b.title}
              </h4>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="w-full mt-14" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)" }} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   BRAND STATEMENT
───────────────────────────────────────────── */
function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #080600 0%, #0e0a00 50%, #080600 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(212,175,55,0.055) 0%, transparent 68%)" }}
      />

      {/* Decorative lines */}
      <div className="absolute left-0 right-0 top-0 pointer-events-none" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)" }} />
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)" }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-[10px] tracking-[0.45em] uppercase mb-8"
          style={{ color: "rgba(212,175,55,0.45)" }}
        >
          Nuestra Filosofía
        </motion.p>
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.7rem, 3.8vw, 2.8rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.45,
            letterSpacing: "0.04em",
            fontStyle: "italic",
          }}
        >
          "Cada pieza que creamos lleva el peso de la historia y la precisión del futuro."
        </motion.blockquote>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-14 mx-auto mt-10"
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-[10px] tracking-[0.25em] mt-6 uppercase"
          style={{ color: "rgba(212,175,55,0.35)" }}
        >
          ROWGOLD — Fundada 2019
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div style={{ background: "#060606" }}>
      <HeroSection />
      <FeaturedProducts />
      <JewelrySections />
      <CategoryGrid />
      <TrustBadges />
      <BrandStatement />
    </div>
  );
}
