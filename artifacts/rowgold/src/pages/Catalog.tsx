import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "./Home";

const GOLD = "#d4af37";

export default function Catalog() {
  const [location] = useLocation();
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const [selectedCategory, setSelectedCategory] = useState(params.get("category") ?? "");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: products, isLoading } = useListProducts({
    category: selectedCategory || undefined,
  });
  const { data: categories } = useListCategories();

  const filtered = (products ?? [])
    .filter((p) =>
      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
            ROWGOLD
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.06em",
            }}
          >
            Catalogo Completo
          </h1>
          <div className="gold-line w-16 mx-auto mt-6" />
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(212,175,55,0.4)" }}
            />
            <input
              type="search"
              placeholder="Buscar piezas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
              className="w-full pl-10 pr-4 py-3 text-sm bg-transparent outline-none"
              style={{
                border: "1px solid rgba(212,175,55,0.2)",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.05em",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)")
              }
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            data-testid="select-sort"
            className="px-4 py-3 text-xs tracking-widest uppercase bg-transparent outline-none cursor-pointer"
            style={{
              border: "1px solid rgba(212,175,55,0.2)",
              color: "rgba(212,175,55,0.7)",
              minWidth: 180,
            }}
          >
            <option value="default" style={{ background: "#111" }}>
              Ordenar por
            </option>
            <option value="price-asc" style={{ background: "#111" }}>
              Precio: Menor a Mayor
            </option>
            <option value="price-desc" style={{ background: "#111" }}>
              Precio: Mayor a Menor
            </option>
            <option value="name" style={{ background: "#111" }}>
              Nombre A-Z
            </option>
          </select>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory("")}
            data-testid="filter-all"
            className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
            style={{
              border: `1px solid ${selectedCategory === "" ? GOLD : "rgba(212,175,55,0.2)"}`,
              color: selectedCategory === "" ? GOLD : "rgba(255,255,255,0.35)",
              background: selectedCategory === "" ? "rgba(212,175,55,0.06)" : "transparent",
            }}
          >
            Todos
          </button>
          {(categories ?? []).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              data-testid={`filter-${cat.slug}`}
              className="px-5 py-2 text-xs tracking-widest uppercase transition-all"
              style={{
                border: `1px solid ${selectedCategory === cat.slug ? GOLD : "rgba(212,175,55,0.2)"}`,
                color:
                  selectedCategory === cat.slug ? GOLD : "rgba(255,255,255,0.35)",
                background:
                  selectedCategory === cat.slug
                    ? "rgba(212,175,55,0.06)"
                    : "transparent",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
          {filtered.length} piezas encontradas
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="luxury-card animate-pulse"
                style={{ aspectRatio: "3/4", borderRadius: 2 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              No se encontraron piezas
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} inView />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
