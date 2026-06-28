import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, MessageCircle } from "lucide-react";
import { 
  useGetCart, 
  useUpdateCartItem, 
  useRemoveFromCart, 
  useClearCart, 
  useCreateOrder 
} from "@/lib/api";

const GOLD = "#d4af37";

// 📱 COLOCA AQUÍ TU NÚMERO DE WHATSAPP (Con el 57 de Colombia y sin espacios ni símbolos)
const TELEFONO_DUEÑO = "573213195879"; 

export default function Cart() {
  const { data: cart, isLoading } = useGetCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();
  const createOrderMutation = useCreateOrder();

  if (isLoading) {
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "#080808" }}
      >
        <div
          className="w-8 h-8 border-t animate-spin"
          style={{ borderColor: GOLD, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const items = cart?.items ?? [];

  // 🔄 Manejadores de eventos conectados a las mutaciones
  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeItemMutation.mutate({ productId });
    } else {
      updateItemMutation.mutate({ productId, data: { quantity: newQty } });
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItemMutation.mutate({ productId });
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  // 🔥 REGISTRA LA VENTA EN EL ADMIN Y LUEGO ABRE WHATSAPP (BLINDADO PARA MÓVILES)
  const enviarPedidoWhatsApp = () => {
    if (items.length === 0) return;

    // 1. Clonamos y respaldamos de inmediato los datos para evitar que se pierdan
    const productosRespaldados = [...items];
    const totalRespaldado = cart?.total ?? 0;

    // 2. Registramos el pedido en la base de datos
    createOrderMutation.mutate(
      {
        data: {
          shippingAddress: "Pendiente - Coordinar por WhatsApp",
          paymentMethod: "WhatsApp",
        },
      },
      {
        onSuccess: (orderCreated) => {
          // 3. Flujo exitoso: Armamos el mensaje usando el ID real generado en el Admin
          let mensaje = `✨ *¡Hola ROWGOLD! Quiero realizar un pedido:* \n`;
          mensaje += `🆔 *Orden N°:* #${orderCreated?.id ?? "WhatsApp"}\n\n`;

          productosRespaldados.forEach((item) => {
            mensaje += `▪️ *${item.product.name}* \n`;
            mensaje += `   Cantidad: ${item.quantity} \n`;
            mensaje += `   Precio: $${(item.product.price * item.quantity).toLocaleString()} COP \n\n`;
          });

          mensaje += `💰 *Total del Pedido:* $${totalRespaldado.toLocaleString()} COP\n\n`;
          mensaje += "¿Me confirman disponibilidad para coordinar el pago y el envío? ¡Muchas gracias!";

          const mensajeEncriptado = encodeURIComponent(mensaje);
          
          // 4. 🔥 PRIMERO redirigimos para evitar bloqueos del navegador móvil por asincronía
          window.location.href = `https://wa.me/${TELEFONO_DUEÑO}?text=${mensajeEncriptado}`;
          
          // 5. DESPUÉS limpiamos el carrito local en la app
          clearCartMutation.mutate();
        },
        onError: (error) => {
          console.error("Error al registrar el pedido en el admin:", error);
          
          // 🚨 PLAN DE CONTINGENCIA: Si el servidor falla, enviamos al cliente a WhatsApp de todos modos
          let mensajeDirecto = `✨ *¡Hola ROWGOLD! Quiero realizar un pedido:* \n\n`;
          productosRespaldados.forEach((item) => {
            mensajeDirecto += `▪️ *${item.product.name}* (x${item.quantity}) \n`;
          });
          mensajeDirecto += `\n💰 *Total:* $${totalRespaldado.toLocaleString()} COP\n\n`;
          mensajeDirecto += "Nota: No se pudo generar N° de orden automático, coordinemos los detalles por aquí.";
          
          const mensajeEncriptado = encodeURIComponent(mensajeDirecto);
          
          // Redirección directa sin limpiar el carrito para que no pierda la selección si quiere reintentar
          window.location.href = `https://wa.me/${TELEFONO_DUEÑO}?text=${mensajeEncriptado}`;
        }
      }
    );
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-6"
      style={{ background: "#080808" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: GOLD }}
          >
            Tu Seleccion
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.06em",
            }}
          >
            Carrito de Compras
          </h1>
          <div className="gold-line w-16 mt-4" />
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <ShoppingBag
              size={48}
              className="mx-auto mb-6"
              style={{ color: "rgba(212,175,55,0.2)" }}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Tu carrito esta vacio
            </p>
            <Link href="/catalog">
              <button
                className="mt-8 px-10 py-4 text-xs tracking-[0.25em] uppercase"
                style={{ border: `1px solid ${GOLD}`, color: GOLD }}
                data-testid="button-go-catalog"
              >
                Explorar Catalogo
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-5 p-5 luxury-card"
                    data-testid={`row-cart-${item.productId}`}
                  >
                    {/* Image */}
                    <Link href={`/product/${item.productId}`}>
                      <div
                        className="shrink-0 overflow-hidden cursor-pointer"
                        style={{ width: 90, height: 90, background: "#111" }}
                      >
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            style={{ filter: "brightness(0.9)" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "1.5rem",
                                color: "rgba(212,175,55,0.15)",
                              }}
                            >
                              RG
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className="text-[10px] tracking-widest uppercase mb-1"
                            style={{ color: "rgba(212,175,55,0.4)" }}
                          >
                            {item.product.category}
                          </p>
                          <Link href={`/product/${item.productId}`}>
                            <p
                              className="cursor-pointer hover:text-amber-400 transition-colors"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "1.05rem",
                                color: "rgba(255,255,255,0.85)",
                                letterSpacing: "0.04em",
                              }}
                            >
                              {item.product.name}
                            </p>
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          data-testid={`button-remove-${item.productId}`}
                          className="text-white/20 hover:text-red-400 transition-colors ml-4"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div
                          className="flex items-center"
                          style={{ border: "1px solid rgba(212,175,55,0.2)" }}
                        >
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity - 1)
                            }
                            data-testid={`button-minus-${item.productId}`}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-400/5 transition-colors"
                            style={{ color: "rgba(212,175,55,0.5)" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-8 text-center text-sm"
                            style={{ color: "rgba(255,255,255,0.8)" }}
                            data-testid={`text-qty-${item.productId}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity + 1)
                            }
                            data-testid={`button-plus-${item.productId}`}
                            className="w-8 h-8 flex items-center justify-center hover:bg-amber-400/5 transition-colors"
                            style={{ color: "rgba(212,175,55,0.5)" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.2rem",
                            fontWeight: 500,
                            color: GOLD,
                          }}
                          data-testid={`text-item-price-${item.productId}`}
                        >
                          $
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={handleClearCart}
                data-testid="button-clear-cart"
                className="text-xs tracking-widest uppercase transition-colors hover:text-red-400 cursor-pointer"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Vaciar Carrito
              </button>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="luxury-card p-8 h-fit"
            >
              <h2
                className="mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.06em",
                }}
              >
                Resumen
              </h2>

              <div className="space-y-4 mb-6">
                <div
                  className="flex justify-between text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">
                    ${(cart?.subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <span>Envio</span>
                  <span data-testid="text-shipping">
                    {(cart?.shipping ?? 0) === 0
                      ? "Gratis"
                      : `$${(cart?.shipping ?? 0).toLocaleString()}`}
                  </span>
                </div>
                <div className="gold-line" />
                <div className="flex justify-between">
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.1rem",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.4rem",
                      fontWeight: 500,
                      color: GOLD,
                    }}
                    data-testid="text-total"
                  >
                    ${(cart?.total ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {(cart?.shipping ?? 0) > 0 && (
                <p
                  className="text-xs mb-6"
                  style={{
                    color: "rgba(212,175,55,0.4)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Agrega ${(500 - (cart?.subtotal ?? 0)).toLocaleString()} mas para envio gratis
                </p>
              )}

              {/* 🔄 BOTÓN DE CHECKOUT CONECTADO AL SERVER */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={enviarPedidoWhatsApp}
                disabled={createOrderMutation.isPending}
                className="w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[0.2em] uppercase cursor-pointer disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #b8960c, #d4af37, #b8960c)",
                  color: "#080808",
                  fontWeight: 600,
                }}
                data-testid="button-checkout"
              >
                {createOrderMutation.isPending ? "Procesando pedido..." : "Pedir por WhatsApp"}
                <MessageCircle size={14} />
              </motion.button>

              <Link href="/catalog">
                <button
                  className="w-full py-3 mt-3 text-xs tracking-widest uppercase text-center transition-colors cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  data-testid="button-continue-shopping"
                >
                  Seguir Comprando
                </button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
