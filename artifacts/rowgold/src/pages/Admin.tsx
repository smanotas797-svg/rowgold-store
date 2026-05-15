import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Package, ShoppingCart, TrendingUp } from "lucide-react";
import {
  useListProducts,
  useListOrders,
  useGetCatalogStats,
  useCreateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const GOLD = "#d4af37";

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
    category: "joyas",
    description: "",
    imageUrl: "",
    featured: false,
    inStock: true,
    material: "",
    collection: "",
  });

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    createProduct.mutate(
      {
        data: {
          name: newProduct.name,
          price: Number(newProduct.price),
          category: newProduct.category,
          description: newProduct.description || undefined,
          imageUrl: newProduct.imageUrl || undefined,
          featured: newProduct.featured,
          inStock: newProduct.inStock,
          material: newProduct.material || undefined,
          collection: newProduct.collection || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          setShowForm(false);
          setNewProduct({ name: "", price: "", category: "joyas", description: "", imageUrl: "", featured: false, inStock: true, material: "", collection: "" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Eliminar este producto?")) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() }),
    });
  };

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Productos" },
    { key: "orders", label: "Pedidos" },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: GOLD }}>Panel de Control</p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.06em",
            }}
          >
            Administracion
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`tab-admin-${tab.key}`}
              className="px-6 py-3 text-xs tracking-widest uppercase transition-all"
              style={{
                color: activeTab === tab.key ? GOLD : "rgba(255,255,255,0.3)",
                borderBottom: activeTab === tab.key ? `2px solid ${GOLD}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                { icon: Package, label: "Total Productos", value: stats?.totalProducts ?? 0, color: GOLD },
                { icon: ShoppingCart, label: "Total Pedidos", value: orders?.length ?? 0, color: "#60a5fa" },
                { icon: TrendingUp, label: "Categorias", value: stats?.totalCategories ?? 0, color: "#34d399" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="luxury-card p-8"
                  data-testid={`stat-admin-${i}`}
                >
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

            {/* By category */}
            {stats?.byCategory && (
              <div className="luxury-card p-8">
                <h3 className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "rgba(212,175,55,0.6)" }}>
                  Productos por Categoria
                </h3>
                <div className="space-y-4">
                  {stats.byCategory.map((cat) => (
                    <div key={cat.category} data-testid={`stat-category-${cat.category}`}>
                      <div className="flex justify-between text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <span className="capitalize">{cat.category}</span>
                        <span style={{ color: GOLD }}>{cat.count}</span>
                      </div>
                      <div style={{ height: 2, background: "rgba(212,175,55,0.1)", borderRadius: 1 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((cat.count / (stats.totalProducts || 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                          style={{ height: "100%", background: GOLD, borderRadius: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                {products?.length ?? 0} productos
              </p>
              <button
                onClick={() => setShowForm(!showForm)}
                data-testid="button-add-product"
                className="flex items-center gap-2 px-6 py-2.5 text-xs tracking-widest uppercase transition-all"
                style={{
                  background: showForm ? "transparent" : "linear-gradient(135deg, #b8960c, #d4af37)",
                  color: showForm ? GOLD : "#080808",
                  border: showForm ? `1px solid ${GOLD}` : "none",
                }}
              >
                <Plus size={12} />
                {showForm ? "Cancelar" : "Nuevo Producto"}
              </button>
            </div>

            {/* Add form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-8 mb-6"
              >
                <h3 className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: "rgba(212,175,55,0.6)" }}>
                  Nuevo Producto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: "name", label: "Nombre", placeholder: "Anillo de Diamante" },
                    { key: "price", label: "Precio (USD)", placeholder: "1299" },
                    { key: "imageUrl", label: "URL de Imagen", placeholder: "https://..." },
                    { key: "material", label: "Material", placeholder: "Oro 18k" },
                    { key: "collection", label: "Coleccion", placeholder: "Classic" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={(newProduct as Record<string, string>)[field.key]}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        data-testid={`input-product-${field.key}`}
                        className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                        style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>
                      Categoria
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                      style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)" }}
                      data-testid="select-product-category"
                    >
                      {["joyas", "relojes", "accesorios", "colecciones"].map((c) => (
                        <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.4)" }}>
                      Descripcion
                    </label>
                    <textarea
                      placeholder="Descripcion del producto..."
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
                  style={{ background: "linear-gradient(135deg, #b8960c, #d4af37)", color: "#080808", fontWeight: 600 }}
                >
                  {createProduct.isPending ? "Guardando..." : "Guardar Producto"}
                </button>
              </motion.div>
            )}

            {/* Product table */}
            <div className="luxury-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                    {["Producto", "Categoria", "Precio", "Stock", "Destacado", "Acciones"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-[10px] tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.5)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr><td colSpan={6} className="text-center py-12"><div className="w-6 h-6 border-t animate-spin mx-auto" style={{ borderColor: GOLD, borderTopColor: "transparent" }} /></td></tr>
                  ) : (
                    (products ?? []).map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-amber-400/[0.02]" style={{ borderBottom: "1px solid rgba(212,175,55,0.05)" }} data-testid={`row-product-${p.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.imageUrl && <img src={p.imageUrl} alt="" className="w-8 h-8 object-cover" style={{ borderRadius: 1 }} />}
                            <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs tracking-wider capitalize" style={{ color: "rgba(212,175,55,0.5)" }}>{p.category}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>${p.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1" style={{ color: p.inStock ? "#34d399" : "#f87171", border: `1px solid ${p.inStock ? "#34d399" : "#f87171"}33` }}>
                            {p.inStock ? "Si" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {p.featured && <span className="text-xs px-2 py-1" style={{ color: GOLD, border: `1px solid ${GOLD}33` }}>Si</span>}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(p.id)}
                            data-testid={`button-delete-${p.id}`}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {(orders ?? []).map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="luxury-card p-6 flex flex-wrap items-center justify-between gap-4"
                data-testid={`row-admin-order-${order.id}`}
              >
                <div>
                  <p className="text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.4)" }}>Pedido #{order.id}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {order.paymentMethod}
                </div>
                <span
                  className="text-xs px-3 py-1 tracking-wider"
                  style={{
                    border: `1px solid ${order.status === "delivered" ? "#34d399" : GOLD}`,
                    color: order.status === "delivered" ? "#34d399" : GOLD,
                  }}
                >
                  {order.status}
                </span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: GOLD }}>
                  ${order.total.toLocaleString()}
                </span>
              </motion.div>
            ))}
            {(!orders || orders.length === 0) && (
              <p className="text-center py-16" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem" }}>
                No hay pedidos aun
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
