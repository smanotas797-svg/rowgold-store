import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Package, ShoppingCart, TrendingUp, ChevronDown } from "lucide-react";
import {
  useListProducts,
  useListOrders,
  useGetCatalogStats,
  useCreateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { sessionId } from "@/contexts/CartContext";

const GOLD = "#d4af37";

const ORDER_STATUS_FLOW = [
  { key: "pending",           label: "Pedido Recibido",   color: "#d4af37" },
  { key: "payment_confirmed", label: "Pago Confirmado",   color: "#60a5fa" },
  { key: "preparing",         label: "Preparando Pedido", color: "#a78bfa" },
  { key: "shipped",           label: "Enviado",            color: "#f59e0b" },
  { key: "in_transit",        label: "En Camino",          color: "#fb923c" },
  { key: "delivered",         label: "Entregado",          color: "#34d399" },
  { key: "cancelled",         label: "Cancelado",          color: "#f87171" },
];

const STATUS_COLOR = Object.fromEntries(ORDER_STATUS_FLOW.map((s) => [s.key, s.color]));
const STATUS_LABEL = Object.fromEntries(ORDER_STATUS_FLOW.map((s) => [s.key, s.label]));

const SUBCATEGORIES = ["cadenas", "pulseras", "aretes", "anillos"];

function StatusDropdown({ orderId, current }: { orderId: number; current: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateStatus = async (status: string) => {
    setLoading(true);
    setOpen(false);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-session-id": sessionId,
      };
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      await queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const color = STATUS_COLOR[current] ?? GOLD;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 text-[10px] tracking-wider uppercase transition-all"
        style={{ border: `1px solid ${color}44`, color, background: `${color}0a` }}
      >
        {loading ? "..." : STATUS_LABEL[current] ?? current}
        <ChevronDown size={10} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            className="absolute right-0 top-full mt-1 z-50 w-48 py-1"
            style={{ background: "#111", border: "1px solid rgba(212,175,55,0.18)", boxShadow: "0 16px 40px rgba(0,0,0,0.8)" }}
          >
            {ORDER_STATUS_FLOW.map((s) => (
              <button
                key={s.key}
                onClick={() => updateStatus(s.key)}
                className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase transition-colors hover:bg-amber-400/[0.05]"
                style={{ color: s.key === current ? s.color : "rgba(255,255,255,0.45)" }}
              >
                {s.key === current && <span className="mr-2">✓</span>}
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: products, isLoading: productsLoading } = useListProducts({});
  const { data: orders } = useListOrders();
  const { data: stats } = useGetCatalogStats();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "joyas",
    subcategory: "",
    description: "",
    imageUrl: "",
    material: "",
    collection: "",
    stockQuantity: "10",
    featured: false,
    inStock: true,
  });

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    createProduct.mutate(
      {
        data: {
          name: newProduct.name,
          price: Number(newProduct.price),
          originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
          category: newProduct.category,
          subcategory: newProduct.subcategory || undefined,
          description: newProduct.description || undefined,
          imageUrl: newProduct.imageUrl || undefined,
          featured: newProduct.featured,
          inStock: newProduct.inStock,
          stockQuantity: Number(newProduct.stockQuantity) || 0,
          material: newProduct.material || undefined,
          collection: newProduct.collection || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          setShowForm(false);
          setNewProduct({ name: "", price: "", originalPrice: "", category: "joyas", subcategory: "", description: "", imageUrl: "", material: "", collection: "", stockQuantity: "10", featured: false, inStock: true });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    deleteProduct.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }) });
  };

  const tabs = [
    { key: "dashboard" as const, label: "Dashboard", icon: TrendingUp },
    { key: "products" as const, label: "Productos", icon: Package },
    { key: "orders" as const, label: "Pedidos", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: "#060606" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(212,175,55,0.55)" }}>Panel de Control</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, color: "rgba(255,255,255,0.9)", letterSpacing: "0.06em" }}>
            Administración
          </h1>
          <div className="w-12 mt-3" style={{ height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.7), transparent)" }} />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10" style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`tab-admin-${tab.key}`}
              className="flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase transition-all"
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

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                { icon: Package,      label: "Total Productos",  value: stats?.totalProducts ?? 0,  color: GOLD },
                { icon: ShoppingCart, label: "Total Pedidos",    value: orders?.length ?? 0,         color: "#60a5fa" },
                { icon: TrendingUp,   label: "Entregados",       value: orders?.filter((o) => o.status === "delivered").length ?? 0, color: "#34d399" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="luxury-card p-8" data-testid={`stat-admin-${i}`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{stat.label}</p>
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300, color: stat.color }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="luxury-card p-8">
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Ingresos Totales</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 300, color: GOLD }}>
                  ${(orders ?? []).reduce((s, o) => s + Number(o.total), 0).toLocaleString()}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {(orders ?? []).filter((o) => o.status !== "cancelled").length} pedidos completados/activos
                </p>
              </div>
              <div className="luxury-card p-8">
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Estado de Pedidos</p>
                <div className="space-y-2">
                  {ORDER_STATUS_FLOW.slice(0, 5).map((s) => {
                    const count = (orders ?? []).filter((o) => o.status === s.key).length;
                    return (
                      <div key={s.key} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-xs flex-1" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
                        <span className="text-xs font-mono" style={{ color: s.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {stats?.byCategory && (
              <div className="luxury-card p-8">
                <h3 className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "rgba(212,175,55,0.6)" }}>Productos por Categoría</h3>
                <div className="space-y-4">
                  {stats.byCategory.map((cat) => (
                    <div key={cat.category} data-testid={`stat-category-${cat.category}`}>
                      <div className="flex justify-between text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <span className="capitalize">{cat.category}</span>
                        <span style={{ color: GOLD }}>{cat.count}</span>
                      </div>
                      <div style={{ height: 2, background: "rgba(212,175,55,0.08)", borderRadius: 1 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((cat.count / (stats.totalProducts || 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }} style={{ height: "100%", background: "linear-gradient(90deg, #9a7808, #d4af37)", borderRadius: 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{products?.length ?? 0} productos</p>
              <button
                onClick={() => setShowForm(!showForm)}
                data-testid="button-add-product"
                className="flex items-center gap-2 px-6 py-2.5 text-xs tracking-widest uppercase transition-all"
                style={{
                  background: showForm ? "transparent" : "linear-gradient(135deg, #9a7808, #d4af37)",
                  color: showForm ? GOLD : "#080808",
                  border: showForm ? `1px solid ${GOLD}` : "none",
                }}
              >
                <Plus size={12} />
                {showForm ? "Cancelar" : "Nuevo Producto"}
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="luxury-card p-8 mb-6">
                  <h3 className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "rgba(212,175,55,0.6)" }}>Nuevo Producto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { key: "name", label: "Nombre *", placeholder: "Anillo de Diamante" },
                      { key: "price", label: "Precio USD *", placeholder: "1299" },
                      { key: "originalPrice", label: "Precio Original (opcional)", placeholder: "1599" },
                      { key: "imageUrl", label: "URL de Imagen", placeholder: "https://..." },
                      { key: "material", label: "Material", placeholder: "Oro 18k" },
                      { key: "collection", label: "Colección", placeholder: "Classic" },
                      { key: "stockQuantity", label: "Stock Disponible", placeholder: "10" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={(newProduct as unknown as Record<string, string>)[field.key]}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          data-testid={`input-product-${field.key}`}
                          className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                          style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)")}
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>Categoría *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value, subcategory: "" }))}
                        className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                        style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)", background: "#0e0e0e" }}
                        data-testid="select-product-category"
                      >
                        {["joyas", "relojes", "accesorios", "colecciones"].map((c) => (
                          <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {newProduct.category === "joyas" && (
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>Subcategoría</label>
                        <select
                          value={newProduct.subcategory}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, subcategory: e.target.value }))}
                          className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                          style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)", background: "#0e0e0e" }}
                          data-testid="select-product-subcategory"
                        >
                          <option value="" style={{ background: "#111" }}>— Ninguna —</option>
                          {SUBCATEGORIES.map((c) => (
                            <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>Descripción</label>
                      <textarea
                        placeholder="Descripción del producto..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        data-testid="input-product-description"
                        className="w-full px-4 py-3 bg-transparent text-sm outline-none resize-none"
                        style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)" }}
                      />
                    </div>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <input type="checkbox" checked={newProduct.featured} onChange={(e) => setNewProduct((p) => ({ ...p, featured: e.target.checked }))} />
                        Destacado
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <input type="checkbox" checked={newProduct.inStock} onChange={(e) => setNewProduct((p) => ({ ...p, inStock: e.target.checked }))} />
                        En Stock
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateProduct}
                    disabled={createProduct.isPending}
                    data-testid="button-save-product"
                    className="mt-6 px-10 py-3 text-xs tracking-widest uppercase disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #9a7808, #d4af37)", color: "#080808", fontWeight: 600 }}
                  >
                    {createProduct.isPending ? "Guardando..." : "Guardar Producto"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="luxury-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                      {["Producto", "Categoría", "Subcategoría", "Precio", "Stock", "Acciones"].map((h) => (
                        <th key={h} className="px-5 py-4 text-left text-[10px] tracking-widest uppercase whitespace-nowrap" style={{ color: "rgba(212,175,55,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {productsLoading ? (
                      <tr><td colSpan={6} className="text-center py-12"><div className="w-6 h-6 border-t animate-spin mx-auto" style={{ borderColor: GOLD, borderTopColor: "transparent", borderRadius: "50%" }} /></td></tr>
                    ) : (
                      (products ?? []).map((p) => (
                        <tr key={p.id} className="transition-colors hover:bg-amber-400/[0.02]" style={{ borderBottom: "1px solid rgba(212,175,55,0.05)" }} data-testid={`row-product-${p.id}`}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-9 h-9 object-cover shrink-0" style={{ borderRadius: 1 }} />}
                              <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs capitalize" style={{ color: "rgba(212,175,55,0.55)" }}>{p.category}</td>
                          <td className="px-5 py-4 text-xs capitalize" style={{ color: "rgba(212,175,55,0.35)" }}>{(p as { subcategory?: string }).subcategory ?? "—"}</td>
                          <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>${Number(p.price).toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs px-2 py-1" style={{ color: p.inStock ? "#34d399" : "#f87171", border: `1px solid ${p.inStock ? "#34d399" : "#f87171"}33` }}>
                              {p.inStock ? "Disponible" : "Agotado"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleDelete(p.id)} data-testid={`button-delete-${p.id}`} className="text-white/20 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>{orders?.length ?? 0} pedidos</p>
            </div>

            <div className="luxury-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                      {["Pedido", "Fecha", "Cliente", "Método Pago", "Total", "Estado", "Acciones"].map((h) => (
                        <th key={h} className="px-5 py-4 text-left text-[10px] tracking-widest uppercase whitespace-nowrap" style={{ color: "rgba(212,175,55,0.5)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(orders ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                          No hay pedidos aún
                        </td>
                      </tr>
                    ) : (
                      (orders ?? []).map((order, i) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="transition-colors hover:bg-amber-400/[0.02]"
                          style={{ borderBottom: "1px solid rgba(212,175,55,0.05)" }}
                          data-testid={`row-admin-order-${order.id}`}
                        >
                          <td className="px-5 py-4 text-xs" style={{ color: "rgba(212,175,55,0.55)" }}>#{order.id}</td>
                          <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {new Date(order.createdAt).toLocaleDateString("es-CO", { month: "short", day: "numeric", year: "2-digit" })}
                          </td>
                          <td className="px-5 py-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {(order.shippingAddress ?? "—").split(",")[0]}
                          </td>
                          <td className="px-5 py-4 text-xs capitalize" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {order.paymentMethod?.replace(/_/g, " ") ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-sm whitespace-nowrap" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>
                            ${Number(order.total).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <StatusDropdown orderId={order.id} current={order.status} />
                          </td>
                          <td className="px-5 py-4">
                            <a href={`/orders/${order.id}`} target="_blank" rel="noreferrer"
                              className="text-xs tracking-wider uppercase transition-colors hover:text-amber-400"
                              style={{ color: "rgba(212,175,55,0.4)" }}>
                              Ver →
                            </a>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
