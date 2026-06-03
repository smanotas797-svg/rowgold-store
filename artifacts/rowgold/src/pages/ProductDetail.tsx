import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  ChevronLeft,
  Minus,
  Plus,
  Shield,
  Truck,
} from "lucide-react";

import {
  useGetProduct,
  useGetFeaturedProducts,
} from "@workspace/api-client-react";

import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "./Home";

const GOLD = "#d4af37";

interface Props {
  id: string;
}

export default function ProductDetail({ id }: Props) {
  const productId = Number(id);
  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: ["getProduct", productId] },
  });
  const { data: allProducts = [] } = useGetFeaturedProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = (allProducts ?? [])
    .filter((p) => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "#080808" }}
      >
        <div className="text-center">
          <div
            className="w-8 h-8 border-t mx-auto animate-spin"
            style={{ borderColor: GOLD, borderTopColor: "transparent" }}
          />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6"
        style={{ background: "#080808" }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Producto no encontrado
        </p>
        <Link href="/catalog">
          <button
            className="text-xs tracking-widest uppercase border px-8 py-3"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
          >
            Ver Catalogo
          </button>
        </Link>
      </div>
    );
  }

  const images = [product.imageUrl, ...(product.images ?? [])].filter(
    Boolean,
  ) as string[];

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-10"
        >
          <Link href="/catalog">
            <span
              className="flex items-center gap-1 text-xs tracking-widest uppercase cursor-pointer hover:text-amber-400 transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <ChevronLeft size={12} />
              Catalogo
            </span>
          </Link>
          <span style={{ color: "rgba(212,175,55,0.3)" }}>/</span>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            {product.name}
          </span>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="luxury-card overflow-hidden mb-4"
              style={{ aspectRatio: "1/1", borderRadius: 2 }}
            >
              {images[selectedImage] ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.92) contrast(1.05)" }}
                  data-testid="img-product-main"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #111, #1a1a00)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "5rem",
                      color: "rgba(212,175,55,0.1)",
                    }}
                  >
                    RG
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    data-testid={`img-thumbnail-${i}`}
                    className="overflow-hidden transition-all"
                    style={{
                      aspectRatio: "1/1",
                      border: `1px solid ${selectedImage === i ? GOLD : "rgba(212,175,55,0.15)"}`,
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ filter: "brightness(0.85)" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "rgba(212,175,55,0.5)" }}
            >
              {product.category}{" "}
              {product.collection ? `· ${product.collection}` : ""}
            </p>

            <h1
              className="mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "0.04em",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={
                      i < Math.round(product.rating!) ? GOLD : "transparent"
                    }
                    color={GOLD}
                  />
                ))}
                <span
                  className="text-xs"
                  style={{ color: "rgba(212,175,55,0.5)" }}
                >
                  {product.rating.toFixed(1)} ({product.reviewCount} reseñas)
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-4 mb-8">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.2rem",
                  fontWeight: 500,
                  color: GOLD,
                }}
                data-testid="text-price"
              >
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span
                  className="text-lg line-through"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="gold-line mb-8" />

            {product.description && (
              <p
                className="text-sm leading-relaxed mb-8"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.8,
                  letterSpacing: "0.03em",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.material && (
                <div>
                  <p
                    className="text-[10px] tracking-widest uppercase mb-1"
                    style={{ color: "rgba(212,175,55,0.4)" }}
                  >
                    Material
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {product.material}
                  </p>
                </div>
              )}
              {product.weight && (
                <div>
                  <p
                    className="text-[10px] tracking-widest uppercase mb-1"
                    style={{ color: "rgba(212,175,55,0.4)" }}
                  >
                    Peso
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {product.weight}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Cantidad
              </p>
              <div
                className="flex items-center"
                style={{ border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-qty-minus"
                  className="w-10 h-10 flex items-center justify-center hover:bg-amber-400/5 transition-colors"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-10 text-center text-sm"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                  data-testid="text-quantity"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-qty-plus"
                  className="w-10 h-10 flex items-center justify-center hover:bg-amber-400/5 transition-colors"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-testid="button-add-to-cart"
              className="w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[0.25em] uppercase font-medium mb-4 transition-all"
              style={{
                background: added
                  ? "rgba(212,175,55,0.2)"
                  : "linear-gradient(135deg, #b8960c, #d4af37, #b8960c)",
                color: added ? GOLD : "#080808",
                border: added ? `1px solid ${GOLD}` : "none",
              }}
            >
              <ShoppingBag size={16} />
              {!product.inStock
                ? "Sin Stock"
                : added
                  ? "Agregado al Carrito"
                  : "Agregar al Carrito"}
            </motion.button>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div
                className="flex items-center gap-2 p-3"
                style={{
                  border: "1px solid rgba(212,175,55,0.1)",
                  background: "rgba(212,175,55,0.02)",
                }}
              >
                <Shield size={14} style={{ color: GOLD }} />
                <span
                  className="text-xs"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Garantia Autentica
                </span>
              </div>
              <div
                className="flex items-center gap-2 p-3"
                style={{
                  border: "1px solid rgba(212,175,55,0.1)",
                  background: "rgba(212,175,55,0.02)",
                }}
              >
                <Truck size={14} style={{ color: GOLD }} />
                <span
                  className="text-xs"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Envio Asegurado
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="gold-line mb-12" />
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                fontWeight: 300,
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.06em",
              }}
            >
              Piezas Relacionadas
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p: any, i: number) => (
                <ProductCard key={p.id} product={p} index={i} inView />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
