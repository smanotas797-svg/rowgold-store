import { Link } from "wouter";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useListOrders } from "@workspace/api-client-react";

const GOLD = "#d4af37";

const statusColors: Record<string, string> = {
  pending: "#d4af37",
  confirmed: "#60a5fa",
  shipped: "#a78bfa",
  delivered: "#34d399",
  cancelled: "#f87171",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function Orders() {
  const { data: orders, isLoading } = useListOrders();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: "#080808" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>Historial</p>
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
          <div className="gold-line w-16 mt-4" />
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="luxury-card h-24 animate-pulse" />
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <Package size={48} className="mx-auto mb-6" style={{ color: "rgba(212,175,55,0.15)" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "rgba(255,255,255,0.25)" }}>
              No tienes pedidos aun
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
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="luxury-card p-6"
                data-testid={`row-order-${order.id}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(212,175,55,0.4)" }}>
                      Pedido #{order.id}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(order.createdAt).toLocaleDateString("es-MX", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(212,175,55,0.4)" }}>Total</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: GOLD }}>
                        ${order.total.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(212,175,55,0.4)" }}>Estado</p>
                      <span
                        className="text-xs tracking-wider px-3 py-1"
                        style={{
                          border: `1px solid ${statusColors[order.status] ?? GOLD}`,
                          color: statusColors[order.status] ?? GOLD,
                          background: `${statusColors[order.status] ?? GOLD}12`,
                        }}
                        data-testid={`status-order-${order.id}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <button
                        className="text-xs tracking-widest uppercase px-5 py-2 transition-all hover:border-amber-400/50"
                        style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.5)" }}
                        data-testid={`button-view-order-${order.id}`}
                      >
                        Ver
                      </button>
                    </Link>
                  </div>
                </div>

                {(order.items as unknown[]).length > 0 && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {(order.items as Array<{ productName: string; quantity: number }>)
                        .map((item) => `${item.productName} ×${item.quantity}`)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
