import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { User, Package, ChevronRight, LogOut, Shield, Edit3, Clock, CheckCircle2, Truck, MapPin, Box, ShieldCheck } from "lucide-react";
import { useListOrders } from "@workspace/api-client-react";
import { useAuth } from "../contexts/AuthContext";

const GOLD = "#d4af37";

const STATUS_STEPS = ["pending", "payment_confirmed", "preparing", "shipped", "in_transit", "delivered"];

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:           { label: "Pedido Recibido",   color: "#d4af37", icon: Package },
  payment_confirmed: { label: "Pago Confirmado",   color: "#60a5fa", icon: ShieldCheck },
  preparing:         { label: "Preparando",         color: "#a78bfa", icon: Box },
  shipped:           { label: "Enviado",             color: "#f59e0b", icon: Truck },
  in_transit:        { label: "En Camino",           color: "#fb923c", icon: MapPin },
  delivered:         { label: "Entregado",           color: "#34d399", icon: CheckCircle2 },
  cancelled:         { label: "Cancelado",           color: "#f87171", icon: Clock },
};

function MiniTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  if (status === "cancelled") return (
    <span className="text-xs px-2 py-0.5" style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>Cancelado</span>
  );

  return (
    <div className="flex items-center gap-0.5">
      {STATUS_STEPS.map((s, i) => (
        <div
          key={s}
          style={{
            width: i <= currentIdx ? 18 : 10,
            height: 3,
            borderRadius: 2,
            background: i <= currentIdx
              ? "linear-gradient(90deg, #9a7808, #d4af37)"
              : "rgba(212,175,55,0.12)",
            transition: "all 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

export default function Profile() {
  const { user, isLoading: userLoading, logout: handleLogout } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useListOrders();
  const [activeTab, setActiveTab] = useState<"orders" | "account">("orders");

  if (userLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: "#060606" }}>
        <div className="w-8 h-8 border-t-2 animate-spin" style={{ borderColor: GOLD, borderTopColor: "transparent", borderRadius: "50%" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6" style={{ background: "#060606" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center" style={{ border: "1px solid rgba(212,175,55,0.2)", borderRadius: "50%" }}>
            <User size={32} style={{ color: "rgba(212,175,55,0.3)" }} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: "rgba(255,255,255,0.85)" }}>
            Mi Perfil
          </p>
          <p className="text-sm mt-3 mb-8" style={{ color: "rgba(255,255,255,0.3)" }}>
            Inicia sesión para ver tus pedidos y gestionar tu cuenta.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.03 }} className="w-full py-3.5 text-xs tracking-[0.25em] uppercase font-semibold"
                style={{ background: "linear-gradient(135deg, #9a7808, #d4af37)", color: "#050505" }}>
                Iniciar Sesión
              </motion.button>
            </Link>
            <Link href="/register">
              <button className="w-full py-3.5 text-xs tracking-[0.25em] uppercase transition-all"
                style={{ border: "1px solid rgba(212,175,55,0.22)", color: "rgba(212,175,55,0.6)" }}>
                Crear Cuenta
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { key: "orders" as const, label: "Mis Pedidos", icon: Package },
    { key: "account" as const, label: "Mi Cuenta", icon: User },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: "#060606" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(212,175,55,0.55)" }}>
                Bienvenido de vuelta
              </p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "0.06em",
              }}>
                {user.username}
              </h1>
              <div className="w-12 mt-3" style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.7), transparent)" }} />
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center" style={{
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "50%",
                background: "rgba(212,175,55,0.05)",
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: GOLD }}>
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs tracking-wider uppercase transition-colors hover:text-red-400"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                <LogOut size={12} />
                Salir
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Total Pedidos", value: orders?.length ?? 0 },
            { label: "Entregados", value: orders?.filter((o) => o.status === "delivered").length ?? 0 },
            { label: "En Proceso", value: orders?.filter((o) => !["delivered", "cancelled", "pending"].includes(o.status)).length ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="luxury-card p-5 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: GOLD }}>
                {stat.value}
              </p>
              <p className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8" style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase transition-all"
              style={{
                color: activeTab === tab.key ? GOLD : "rgba(255,255,255,0.3)",
                borderBottom: activeTab === tab.key ? `2px solid ${GOLD}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="luxury-card h-24 animate-pulse" />)}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-20">
                <Package size={40} className="mx-auto mb-5" style={{ color: "rgba(212,175,55,0.12)" }} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgba(255,255,255,0.25)" }}>
                  Aún no tienes pedidos
                </p>
                <Link href="/catalog">
                  <button className="mt-6 px-10 py-3 text-xs tracking-[0.25em] uppercase transition-all hover:border-amber-400/50"
                    style={{ border: `1px solid ${GOLD}`, color: GOLD }}>
                    Explorar Catálogo
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, i) => {
                  const meta = STATUS_META[order.status] ?? STATUS_META.pending;
                  const StatusIcon = meta.icon;
                  const items = order.items as Array<{ productName: string; quantity: number; imageUrl?: string }>;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="luxury-card p-6 group"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* Left: order info */}
                        <div className="flex gap-4 items-start">
                          {/* Status icon */}
                          <div className="w-10 h-10 flex items-center justify-center shrink-0"
                            style={{ border: `1px solid ${meta.color}33`, background: `${meta.color}0a`, borderRadius: "50%" }}>
                            <StatusIcon size={16} style={{ color: meta.color }} />
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(212,175,55,0.4)" }}>
                              Pedido #{order.id}
                            </p>
                            <p className="text-sm mb-1.5" style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              color: meta.color,
                              fontSize: "0.95rem",
                            }}>
                              {meta.label}
                            </p>
                            <MiniTimeline status={order.status} />
                          </div>
                        </div>

                        {/* Right: total + view */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(212,175,55,0.4)" }}>Total</p>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: GOLD }}>
                              ${order.total.toLocaleString()}
                            </p>
                          </div>
                          <Link href={`/orders/${order.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.5)" }}
                              className="flex items-center gap-1.5 text-xs tracking-widest uppercase px-5 py-2.5 transition-all"
                              style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.5)" }}
                            >
                              Ver <ChevronRight size={11} />
                            </motion.button>
                          </Link>
                        </div>
                      </div>

                      {/* Items preview */}
                      {items.length > 0 && (
                        <div className="mt-4 pt-4 flex items-center gap-3" style={{ borderTop: "1px solid rgba(212,175,55,0.05)" }}>
                          <div className="flex -space-x-2">
                            {items.slice(0, 3).map((item, j) => (
                              item.imageUrl ? (
                                <img key={j} src={item.imageUrl} alt={item.productName}
                                  className="w-8 h-8 object-cover rounded-sm"
                                  style={{ border: "1px solid rgba(212,175,55,0.2)" }} />
                              ) : (
                                <div key={j} className="w-8 h-8 flex items-center justify-center rounded-sm"
                                  style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.04)" }}>
                                  <Package size={10} style={{ color: "rgba(212,175,55,0.3)" }} />
                                </div>
                              )
                            ))}
                          </div>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                            {items.map((item) => `${item.productName} ×${item.quantity}`).join(", ")}
                          </p>
                          <p className="text-xs ml-auto shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                            {new Date(order.createdAt).toLocaleDateString("es-CO", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Account tab */}
        {activeTab === "account" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="luxury-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(212,175,55,0.6)" }}>Información Personal</h2>
                <button className="text-xs tracking-wider flex items-center gap-1.5 transition-colors hover:text-amber-400"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  <Edit3 size={11} /> Editar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nombre de Usuario", value: user.username },
                  { label: "Rol", value: user.role === "admin" ? "Administrador" : "Cliente" },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "rgba(212,175,55,0.4)" }}>{field.label}</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="luxury-card p-8">
              <h2 className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: "rgba(212,175,55,0.6)" }}>Seguridad</h2>
              <div className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}>
                <div className="flex items-center gap-3">
                  <Shield size={15} style={{ color: "rgba(212,175,55,0.4)" }} />
                  <div>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>Contraseña</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>••••••••</p>
                  </div>
                </div>
                <button className="text-xs tracking-wider transition-colors hover:text-amber-400" style={{ color: "rgba(212,175,55,0.5)" }}>
                  Cambiar
                </button>
              </div>
            </div>

            {user.role === "admin" && (
              <Link href="/admin">
                <motion.div
                  whileHover={{ scale: 1.01, borderColor: "rgba(212,175,55,0.35)" }}
                  className="luxury-card p-6 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} style={{ color: GOLD }} />
                    <div>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}>Panel de Administración</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Gestionar productos, pedidos y más</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "rgba(212,175,55,0.4)" }} />
                </motion.div>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
