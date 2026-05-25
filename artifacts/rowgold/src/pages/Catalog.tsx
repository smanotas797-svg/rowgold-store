import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import {
  useGetFeaturedProducts,
  useListCategories,
} from "@workspace/api-client-react";
import { ProductCard } from "./Home";

const GOLD = "#d4af37";

const SUBCATEGORY_MAP: Record<
  string,
  { label: string; subs: { key: string; label: string }[] }
> = {
  joyas: {
    label: "Joyería",
    subs: [
      { key: "anillos", label: "Anillos" },
      { key: "cadenas", label: "Cadenas" },
      { key: "pulseras", label: "Pulseras" },
      { key: "aretes", label: "Aretes" },
    ],
  },
};

function FilterPill({
  active,
  onClick,
  label,
  testId,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  testId?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      data-testid={testId}
      whileTap={{ scale: 0.96 }}
      className="px-5 py-2 text-[11px] tracking-[0.22em] uppercase transition-all"
      style={{
        border: `1px solid ${active ? GOLD : "rgba(212,175,55,0.18)"}`,
        color: active ? GOLD : "rgba(255,255,255,0.32)",
        background: active ? "rgba(212,175,55,0.06)" : "transparent",
        transition: "all 0.25s ease",
      }}
    >
      {label}
    </motion.button>
  );
}

export default function Catalog() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const [selectedCategory, setSelectedCategory] = useState(
    urlParams.get("category") ?? "",
  );
  const [selectedSub, setSelectedSub] = useState(urlParams.get("sub") ?? "");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useGetFeaturedProducts({
    category: selectedCategory || undefined,
  });
  const { data: categories } = useListCategories();

  const hasSubs = selectedCategory && SUBCATEGORY_MAP[selectedCategory];

  const filtered = (products ?? [])
    .filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (selectedSub) {
        const sub = (p as { subcategory?: string }).subcategory;
        if (sub !== selectedSub) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating")
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      return 0;
    });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSub("");
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-6"
      style={{ background: "#060606" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p
            className="text-[10px] tracking-[0.45em] uppercase mb-4"
            style={{ color: "rgba(212,175,55,0.55)" }}
          >
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
            {selectedCategory
              ? (categories?.find((c) => c.slug === selectedCategory)?.name ??
                "Catálogo")
              : "Catálogo Completo"}
          </h1>
          {selectedSub && (
            <p
              className="text-sm mt-2 capitalize"
              style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.1em" }}
            >
              {selectedSub}
            </p>
          )}
          <div
            className="w-14 mx-auto mt-5"
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)",
            }}
          />
        </motion.div>

        {/* Search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={13}
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
                border: "1px solid rgba(212,175,55,0.18)",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.04em",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(212,175,55,0.18)")
              }
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={12} style={{ color: "rgba(212,175,55,0.4)" }} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            data-testid="select-sort"
            className="px-4 py-3 text-xs tracking-widest uppercase bg-transparent outline-none cursor-pointer"
            style={{
              border: "1px solid rgba(212,175,55,0.18)",
              color: "rgba(212,175,55,0.6)",
              minWidth: 190,
              background: "#0a0a0a",
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
            <option value="rating" style={{ background: "#111" }}>
              Mejor Valorados
            </option>
          </select>
        </div>

        {/* Category filters */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <FilterPill
              active={selectedCategory === ""}
              onClick={() => handleCategoryChange("")}
              label="Todos"
              testId="filter-all"
            />
            {(categories ?? []).map((cat) => (
              <FilterPill
                key={cat.id}
                active={selectedCategory === cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                label={cat.name}
                testId={`filter-${cat.slug}`}
              />
            ))}
          </div>

          {/* Subcategory pills — only if category has subs */}
          {hasSubs && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 pt-3 pl-3"
              style={{ borderLeft: "2px solid rgba(212,175,55,0.15)" }}
            >
              <FilterPill
                active={selectedSub === ""}
                onClick={() => setSelectedSub("")}
                label="Toda la Joyería"
                testId="sub-filter-all"
              />
              {SUBCATEGORY_MAP[selectedCategory].subs.map((sub) => (
                <FilterPill
                  key={sub.key}
                  active={selectedSub === sub.key}
                  onClick={() => setSelectedSub(sub.key)}
                  label={sub.label}
                  testId={`sub-filter-${sub.key}`}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-8">
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em" }}
          >
            {filtered.length}{" "}
            {filtered.length === 1 ? "pieza encontrada" : "piezas encontradas"}
            {selectedSub && (
              <span
                className="ml-2 capitalize"
                style={{ color: "rgba(212,175,55,0.4)" }}
              >
                en {selectedSub}
              </span>
            )}
          </p>
          {(search || selectedCategory || selectedSub) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setSelectedSub("");
              }}
              className="flex items-center gap-1.5 text-xs tracking-wider transition-colors hover:text-amber-400"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              <X size={10} /> Limpiar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="luxury-card animate-pulse"
                style={{ aspectRatio: "3/4" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-28"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "rgba(255,255,255,0.18)",
              }}
            >
              No se encontraron piezas
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setSelectedSub("");
              }}
              className="mt-6 px-8 py-3 text-xs tracking-[0.25em] uppercase transition-all"
              style={{
                border: "1px solid rgba(212,175,55,0.25)",
                color: "rgba(212,175,55,0.6)",
              }}
            >
              Ver Todo
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                inView
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
