import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star, Shield, Truck, Award } from "lucide-react";
import { useGetFeaturedProducts, useListCategories, useGetCatalogStats } from "@workspace/api-client-react";

const GOLD = "#d4af37";

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060606 0%, #0f0c00 50%, #060606 100%)" }}
    >
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            background: GOLD,
            boxShadow: `0 0 4px rgba(212,175,55,0.8)`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -(20 + Math.random() * 40), 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs tracking-[0.4em] uppercase mb-8"
          style={{ color: "rgba(212,175,55,0.6)" }}
        >
          Coleccion 2024
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            fontWeight: 300,
            lineHeight: 1.05,
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
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="gold-line w-24 mx-auto my-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-sm tracking-widest mb-12"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}
        >
          Joyeria fina &bull; Relojes &bull; Accesorios de lujo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/catalog" data-testid="button-explore-collection">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium transition-all"
              style={{
                background: "linear-gradient(135deg, #b8960c, #d4af37, #b8960c)",
                color: "#080808",
                letterSpacing: "0.2em",
                fontSize: "0.7rem",
              }}
            >
              Explorar Coleccion
              <ArrowRight size={14} />
            </motion.button>
          </Link>
          <Link href="/catalog?featured=true" data-testid="button-view-featured">
            <motion.button
              whileHover={{ scale: 1.04, borderColor: GOLD }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-10 py-4 text-sm tracking-[0.2em] uppercase transition-all"
              style={{
                border: "1px solid rgba(212,175,55,0.3)",
                color: "rgba(212,175,55,0.8)",
                letterSpacing: "0.2em",
                fontSize: "0.7rem",
                background: "transparent",
              }}
            >
              Piezas Destacadas
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,175,55,0.4)" }}>
          Scroll
        </span>
        <motion.div
          style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(212,175,55,0.4), transparent)" }}
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

function FeaturedProducts() {
  const { data: products, isLoading } = useGetFeaturedProducts();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
          Seleccion Exclusiva
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.95)",
            letterSpacing: "0.06em",
          }}
        >
          Piezas Destacadas
        </h2>
        <div className="gold-line w-16 mx-auto mt-6" />
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="luxury-card aspect-[3/4] rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(products ?? []).slice(0, 6).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} inView={inView} />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="text-center mt-14"
      >
        <Link href="/catalog" data-testid="button-view-all-products">
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="text-xs tracking-[0.25em] uppercase border px-10 py-4 transition-all"
            style={{
              border: "1px solid rgba(212,175,55,0.3)",
              color: "rgba(212,175,55,0.7)",
            }}
          >
            Ver Todo el Catalogo
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}

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
      transition={{ duration: 0.7, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`}>
        <div
          className="luxury-card overflow-hidden transition-all duration-500"
          style={{ borderRadius: "2px" }}
        >
          {/* Image */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "3/4",
              background: "linear-gradient(135deg, #0f0f0f, #181818)",
            }}
          >
            {product.imageUrl ? (
              <motion.img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ filter: "brightness(0.9) contrast(1.05)" }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #111, #1a1a00)" }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "3rem",
                    color: "rgba(212,175,55,0.15)",
                    letterSpacing: "0.2em",
                  }}
                >
                  RG
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase px-6 py-3"
                style={{
                  border: "1px solid rgba(212,175,55,0.6)",
                  color: GOLD,
                }}
              >
                Ver Pieza
              </span>
            </motion.div>

            {/* Collection tag */}
            {product.collection && (
              <div
                className="absolute top-3 left-3 px-3 py-1 text-[9px] tracking-widest uppercase"
                style={{
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  color: "rgba(212,175,55,0.8)",
                  backdropFilter: "blur(4px)",
                }}
              >
                {product.collection}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <p className="text-[10px] tracking-[0.25em] uppercase mb-1.5" style={{ color: "rgba(212,175,55,0.5)" }}>
              {product.category}
            </p>
            <h3
              className="mb-3 leading-snug"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1rem",
                fontWeight: 400,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.04em",
              }}
            >
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    color: GOLD,
                  }}
                >
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through" style={{ color: "rgba(255,255,255,0.2)" }}>
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star size={10} fill={GOLD} color={GOLD} />
                  <span className="text-xs" style={{ color: "rgba(212,175,55,0.6)" }}>
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CategoryGrid() {
  const { data: categories } = useListCategories();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const categoryImages: Record<string, string> = {
    joyas: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    relojes: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    accesorios: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    colecciones: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
  };

  return (
    <section
      ref={ref}
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #060606 0%, #0a0900 50%, #060606 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
            Explorar
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.06em",
            }}
          >
            Nuestras Categorias
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(categories ?? []).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
              data-testid={`card-category-${cat.id}`}
            >
              <Link href={`/catalog?category=${cat.slug}`}>
                <div
                  className="relative overflow-hidden luxury-card transition-all duration-500"
                  style={{ aspectRatio: "3/4", borderRadius: "2px" }}
                >
                  <img
                    src={categoryImages[cat.slug] ?? "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80"}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "brightness(0.5) contrast(1.1)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.4rem",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.95)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "rgba(212,175,55,0.6)" }}>
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

function TrustBadges() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const badges = [
    { icon: Shield, title: "Garantia Vitalicia", desc: "Certificado de autenticidad" },
    { icon: Truck, title: "Envio Gratis", desc: "En compras mayores a $500" },
    { icon: Award, title: "Materiales Premium", desc: "Oro 18k, platino y diamantes" },
    { icon: Star, title: "5 Estrellas", desc: "Miles de clientes satisfechos" },
  ];

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="gold-line mb-16" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
              data-testid={`badge-trust-${i}`}
            >
              <div
                className="w-12 h-12 mx-auto mb-4 flex items-center justify-center"
                style={{
                  border: "1px solid rgba(212,175,55,0.25)",
                  background: "rgba(212,175,55,0.05)",
                }}
              >
                <b.icon size={20} style={{ color: GOLD }} />
              </div>
              <h4
                className="text-sm mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.06em",
                }}
              >
                {b.title}
              </h4>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="gold-line mt-16" />
      </div>
    </section>
  );
}

function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-32 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0900 0%, #100d00 50%, #0a0900 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-[0.4em] uppercase mb-8"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          Nuestra Filosofia
        </motion.p>
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.4,
            letterSpacing: "0.04em",
            fontStyle: "italic",
          }}
        >
          "Cada pieza que creamos lleva el peso de la historia y la precision del futuro."
        </motion.blockquote>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="gold-line w-16 mx-auto mt-10"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-xs tracking-[0.2em] mt-6"
          style={{ color: "rgba(212,175,55,0.4)" }}
        >
          ROWGOLD, Fundada 2019
        </motion.p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div style={{ background: "#080808" }}>
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
      <TrustBadges />
      <BrandStatement />
    </div>
  );
}
