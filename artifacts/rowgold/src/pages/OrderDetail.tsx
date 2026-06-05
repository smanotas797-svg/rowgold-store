import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Box,
} from "lucide-react";
import { useGetOrder } from "@workspace/api-client-react";

const GOLD = "#d4af37";

const ORDER_STEPS = [
  {
    key: "pending",
    icon: Package,
    label: "Pedido Recibido",
    desc: "Tu pedido fue recibido exitosamente",
  },
  {
    key: "payment_confirmed",
    icon: ShieldCheck,
    label: "Pago Confirmado",
    desc: "El pago ha sido verificado",
  },
  {
    key: "preparing",
    icon: Box,
    label: "Preparando Pedido",
    desc: "Estamos preparando tu paquete",
  },
  {
    key: "shipped",
    icon: Truck,
    label: "Enviado",
    desc: "Tu paquete está en camino",
  },
  {
    key: "in_transit",
    icon: MapPin,
    label: "En Camino",
    desc: "Tu pedido está en tránsito local",
  },
  {
    key: "delivered",
    icon: CheckCircle2,
    label: "Entregado",
    desc: "¡Tu pedido fue entregado!",
  },
];

const STATUS_ORDER = [
  "pending",
  "payment_confirmed",
  "preparing",
  "shipped",
  "in_transit",
  "delivered",
];

function getStepIndex(status: string) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function TrackingTimeline({
  status,
  history,
}: {
  status: string;
  history: Array<{ status: string; timestamp: string; note?: string }>;
}) {
  const currentIdx = getStepIndex(status);
  const progress =
    status === "cancelled"
      ? 0
      : Math.round((currentIdx / (ORDER_STEPS.length - 1)) * 100);

  const historyMap = new Map(history.map((h) => [h.status, h]));

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-10">
        <div
          className="flex justify-between text-[10px] tracking-widest uppercase mb-2"
          style={{ color: "rgba(212,175,55,0.4)" }}
        >
          <span>Progreso del Pedido</span>
          <span>{status === "cancelled" ? "Cancelado" : `${progress}%`}</span>
        </div>
        <div
          className="relative h-[2px] rounded-full"
          style={{ background: "rgba(212,175,55,0.12)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: status === "cancelled" ? "0%" : `${progress}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 h-full"
            style={{
              background: "linear-gradient(90deg, #9a7808, #d4af37, #f5e06e)",
              boxShadow: "0 0 8px rgba(212,175,55,0.5)",
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connector line */}
        <div
          className="absolute left-5 top-10 bottom-10 w-[1px] hidden sm:block"
          style={{
            background:
              "linear-gradient(to bottom, rgba(212,175,55,0.25), rgba(212,175,55,0.05))",
          }}
        />

        <div className="space-y-6">
          {ORDER_STEPS.map((step, i) => {
            const isDone = i <= currentIdx && status !== "cancelled";
            const isActive = i === currentIdx && status !== "cancelled";
            const Icon = step.icon;
            const historyEntry = historyMap.get(step.key);

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex gap-5 items-start"
              >
                {/* Step icon */}
                <div
                  className="relative z-10 flex items-center justify-center shrink-0 transition-all duration-500"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `1px solid ${isDone ? GOLD : "rgba(212,175,55,0.18)"}`,
                    background: isActive
                      ? "rgba(212,175,55,0.15)"
                      : isDone
                        ? "rgba(212,175,55,0.08)"
                        : "rgba(0,0,0,0.4)",
                    boxShadow: isActive
                      ? `0 0 16px rgba(212,175,55,0.3)`
                      : "none",
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: isDone ? GOLD : "rgba(212,175,55,0.22)",
                      transition: "color 0.4s",
                    }}
                  />

                  {/* Pulse for active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ border: `1px solid rgba(212,175,55,0.4)` }}
                    />
                  )}
                </div>

                {/* Content */}
                <div
                  className="flex-1 pb-6"
                  style={{
                    borderBottom:
                      i < ORDER_STEPS.length - 1
                        ? "1px solid rgba(212,175,55,0.05)"
                        : "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p
                        className="text-sm font-medium mb-0.5"
                        style={{
                          color: isActive
                            ? "rgba(255,255,255,0.95)"
                            : isDone
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(255,255,255,0.22)",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1rem",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {step.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: isDone
                            ? "rgba(255,255,255,0.35)"
                            : "rgba(255,255,255,0.15)",
                        }}
                      >
                        {historyEntry?.note ?? step.desc}
                      </p>
                    </div>
                    {historyEntry?.timestamp && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Clock
                          size={10}
                          style={{ color: "rgba(212,175,55,0.35)" }}
                        />
                        <span
                          className="text-[10px]"
                          style={{ color: "rgba(212,175,55,0.4)" }}
                        >
                          {new Date(historyEntry.timestamp).toLocaleString(
                            "es-CO",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-[9px] tracking-[0.2em] uppercase"
                      style={{
                        border: `1px solid rgba(212,175,55,0.35)`,
                        color: GOLD,
                        background: "rgba(212,175,55,0.05)",
                      }}
                    >
                      <Star size={8} fill={GOLD} color={GOLD} />
                      Estado actual
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface OrderDetailProps {
  id: string;
}

export default function OrderDetail({ id }: OrderDetailProps) {
  const { data: order, isLoading } = useGetOrder(Number(id));

  if (isLoading) {
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "#060606" }}
      >
        <div
          className="w-8 h-8 border-t-2 animate-spin"
          style={{
            borderColor: GOLD,
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "#060606" }}
      >
        <div className="text-center">
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Pedido no encontrado
          </p>
          <Link href="/orders">
            <button
              className="mt-6 px-8 py-3 text-xs tracking-widest uppercase"
              style={{ border: `1px solid ${GOLD}`, color: GOLD }}
            >
              Volver
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items as Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  const history =
    (order.statusHistory as Array<{
      status: string;
      timestamp: string;
      note?: string;
    }>) ?? [];

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-6"
      style={{ background: "#060606" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link href="/orders">
            <button
              className="flex items-center gap-2 text-xs tracking-widest uppercase mb-6 hover:text-amber-400 transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <ArrowLeft size={12} /> Mis Pedidos
            </button>
          </Link>
          <p
            className="text-[10px] tracking-[0.4em] uppercase mb-2"
            style={{ color: "rgba(212,175,55,0.55)" }}
          >
            Seguimiento
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.06em",
            }}
          >
            Pedido #{order.id}
          </h1>
          <div
            className="w-14 mt-4"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, rgba(212,175,55,0.7), transparent)",
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Tracking timeline — 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 luxury-card p-8"
          >
            <h2
              className="text-[10px] tracking-[0.3em] uppercase mb-8"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              Estado del Envío
            </h2>
            <TrackingTimeline status={order.status} history={history} />

            {order.trackingNumber && (
              <div
                className="mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
              >
                <p
                  className="text-[10px] tracking-widest uppercase mb-1"
                  style={{ color: "rgba(212,175,55,0.4)" }}
                >
                  Número de Guía
                </p>
                <p
                  className="text-sm font-mono"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {order.trackingNumber}
                </p>
              </div>
            )}
          </motion.div>

          {/* Order summary — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="luxury-card p-6"
            >
              <h2
                className="text-[10px] tracking-[0.3em] uppercase mb-5"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                Productos
              </h2>
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 object-cover shrink-0"
                        style={{ filter: "brightness(0.9)" }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 shrink-0 flex items-center justify-center"
                        style={{
                          border: "1px solid rgba(212,175,55,0.15)",
                          background: "rgba(212,175,55,0.03)",
                        }}
                      >
                        <Package
                          size={16}
                          style={{ color: "rgba(212,175,55,0.2)" }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontFamily: "'Cormorant Garamond', serif",
                        }}
                      >
                        {item.productName}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        ×{item.quantity}
                      </p>
                    </div>
                    <p
                      className="text-sm shrink-0"
                      style={{
                        color: GOLD,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      ${(item.price * item.quantity ?? 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-5 pt-5 space-y-2"
                style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
              >
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <span>Subtotal</span>
                  <span>${(order.subtotal ?? 0).toLocaleString()}</span>
                </div>
                <div
                  className="flex justify-between text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <span>Envío</span>
                  <span>
                    {order.shipping === 0 ? "Gratis" : `$${order.shipping}`}
                  </span>
                </div>
                <div
                  className="flex justify-between pt-2"
                  style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.25rem",
                      color: GOLD,
                    }}
                  >
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Shipping address */}
            {order.shippingAddress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-card p-6"
              >
                <h2
                  className="text-[10px] tracking-[0.3em] uppercase mb-4"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  Dirección de Envío
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}
                >
                  {order.shippingAddress}
                </p>
              </motion.div>
            )}

            {/* Payment info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="luxury-card p-6"
            >
              <h2
                className="text-[10px] tracking-[0.3em] uppercase mb-4"
                style={{ color: "rgba(212,175,55,0.6)" }}
              >
                Pago
              </h2>
              <div className="flex justify-between items-center">
                <p
                  className="text-sm capitalize"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {order.paymentMethod?.replace(/_/g, " ")}
                </p>
                <span
                  className="text-xs px-3 py-1"
                  style={{
                    border: `1px solid rgba(212,175,55,0.3)`,
                    color: "rgba(212,175,55,0.7)",
                  }}
                >
                  {order.status === "payment_confirmed" ||
                  order.status === "preparing" ||
                  order.status === "shipped" ||
                  order.status === "in_transit" ||
                  order.status === "delivered"
                    ? "Confirmado"
                    : "Pendiente"}
                </span>
              </div>
              <p
                className="text-xs mt-3"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {new Date(order.createdAt).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
