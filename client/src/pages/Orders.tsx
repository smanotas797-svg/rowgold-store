import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Box,
  ShieldCheck,
} from "lucide-react";
import { useListOrders } from "@/lib/api";

const GOLD = "#d4af37";

const STATUS_STEPS = [
  "pending",
  "payment_confirmed",
  "preparing",
  "shipped",
  "in_transit",
  "delivered",
];

const STATUS_META: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: { label: "Pedido Recibido", color: "#d4af37", icon: Package },
  payment_confirmed: {
    label: "Pago Confirmado",
    color: "#60a5fa",
    icon: ShieldCheck,
  },
  preparing: { label: "Preparando Pedido", color: "#a78bfa", icon: Box },
  shipped: { label: "Enviado", color: "#f59e0b", icon: Truck },
  in_transit: { label: "En Camino", color: "#fb923c", icon: MapPin },
  delivered: { label: "Entregado", color: "#34d399", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "#f87171", icon: Clock },
};

function MiniTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  if (status === "cancelled") {
    return (
      <span
        className="text-[9px] px-2 py-0.5 tracking-wider"
        style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
      >
        Cancelado
      </span>
    );
  }
  return (
    <div className="flex items-center gap-0.5">
      {STATUS_STEPS.map((_, i) => (
        <div
          key={i}
          style={{
            width: i <= currentIdx ? 14 : 7,
            height: 2,
            borderRadius: 1,
            background:
              i <= currentIdx
                ? "linear-gradient(90deg, #9a7808, #d4af37)"
                : "rgba(212,175,55,0.1)",
            transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

export default function Orders() {
  const { data: orders, isLoading } = useListOrders();

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-6"
      style={{ background: "#060606" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p
            className="text-[10px] tracking-[0.4em] uppercase mb-2"
            style={{ color: "rgba(212,175,55,0.55)" }}
          >
            Historial
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
            Mis Pedidos
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

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="luxury-card h-28 animate-pulse" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <Package
              size={48}
              className="mx-auto mb-6"
              style={{ color: "rgba(212,175,55,0.1)" }}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              No tienes pedidos aún
            </p>
            <Link href="/catalog">
              <button
                className="mt-8 px-10 py-4 text-xs tracking-[0.25em] uppercase transition-all hover:border-amber-400/50"
                style={{ border: `1px solid ${GOLD}`, color: GOLD }}
                data-testid="button-go-catalog"
              >
                Explorar Catálogo
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.pending;
              const StatusIcon = meta.icon;
              const items = order.items as Array<{
                productName: string;
                quantity: number;
                imageUrl?: string;
              }>;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="luxury-card p-6"
                  data-testid={`row-order-${order.id}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      {/* Status icon */}
                      <div
                        className="w-10 h-10 flex items-center justify-center shrink-0"
                        style={{
                          border: `1px solid ${meta.color}33`,
                          background: `${meta.color}0a`,
                          borderRadius: "50%",
                        }}
                      >
                        <StatusIcon size={16} style={{ color: meta.color }} />
                      </div>
                      <div>
                        <p
                          className="text-[10px] tracking-widest uppercase mb-0.5"
                          style={{ color: "rgba(212,175,55,0.4)" }}
                        >
                          Pedido #{order.id}
                        </p>
                        <p
                          className="mb-2"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1rem",
                            color: meta.color,
                          }}
                        >
                          {meta.label}
                        </p>
                        <MiniTimeline status={order.status} />
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p
                          className="text-[10px] tracking-widest uppercase mb-0.5"
                          style={{ color: "rgba(212,175,55,0.4)" }}
                        >
                          Total
                        </p>
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.3rem",
                            color: GOLD,
                          }}
                        >
                          ${(order.total ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            borderColor: "rgba(212,175,55,0.5)",
                          }}
                          className="flex items-center gap-1.5 text-xs tracking-widest uppercase px-5 py-2.5 transition-all"
                          style={{
                            border: "1px solid rgba(212,175,55,0.2)",
                            color: "rgba(212,175,55,0.5)",
                          }}
                          data-testid={`button-view-order-${order.id}`}
                        >
                          Ver <ChevronRight size={11} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div
                      className="mt-4 pt-4 flex items-center gap-3 flex-wrap"
                      style={{ borderTop: "1px solid rgba(212,175,55,0.05)" }}
                    >
                      <div className="flex -space-x-2">
                        {items.slice(0, 3).map((item, j) =>
                          item.imageUrl ? (
                            <img
                              key={j}
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-7 h-7 object-cover"
                              style={{
                                border: "1px solid rgba(212,175,55,0.2)",
                              }}
                            />
                          ) : (
                            <div
                              key={j}
                              className="w-7 h-7 flex items-center justify-center"
                              style={{
                                border: "1px solid rgba(212,175,55,0.15)",
                                background: "#0e0e0e",
                              }}
                            >
                              <Package
                                size={9}
                                style={{ color: "rgba(212,175,55,0.2)" }}
                              />
                            </div>
                          ),
                        )}
                      </div>
                      <p
                        className="text-xs flex-1"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        {items
                          .map((it) => `${it.productName} ×${it.quantity}`)
                          .join(", ")}
                      </p>
                      <p
                        className="text-xs shrink-0"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("es-CO", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
