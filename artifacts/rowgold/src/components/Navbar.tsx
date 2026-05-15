import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/catalog?category=joyas", label: "Joyas" },
  { href: "/catalog?category=relojes", label: "Relojes" },
  { href: "/catalog?category=accesorios", label: "Accesorios" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(8,8,8,0.97)"
            : "linear-gradient(180deg, rgba(8,8,8,0.8) 0%, transparent 100%)",
          borderBottom: scrolled ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home-logo">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={rowgoldLogo}
                alt="ROWGOLD"
                style={{ width: 36, height: 36, objectFit: "contain", filter: "brightness(1.1)" }}
              />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  background: "linear-gradient(135deg, #b8960c, #d4af37, #f5e06e, #d4af37)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ROWGOLD
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                <motion.span
                  whileHover={{ color: "#d4af37" }}
                  className="text-sm tracking-widest uppercase cursor-pointer transition-colors"
                  style={{
                    color: location === link.href ? "#d4af37" : "rgba(255,255,255,0.65)",
                    fontWeight: 400,
                    letterSpacing: "0.15em",
                    fontSize: "0.7rem",
                  }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-amber-400/70 tracking-wider">{user.name}</span>
                {user.role === "admin" && (
                  <Link href="/admin" data-testid="link-admin">
                    <span className="text-xs tracking-widest uppercase cursor-pointer" style={{ color: "rgba(212,175,55,0.7)" }}>
                      Admin
                    </span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  data-testid="button-logout"
                  className="text-white/40 hover:text-amber-400 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link href="/login" data-testid="link-login" className="hidden md:block">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <User size={18} className="text-white/50 hover:text-amber-400 transition-colors cursor-pointer" />
                </motion.div>
              </Link>
            )}

            <Link href="/cart" data-testid="link-cart">
              <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
                <ShoppingBag size={20} className="text-white/70 hover:text-amber-400 transition-colors" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex items-center justify-center text-black text-[9px] font-bold rounded-full"
                    style={{
                      width: 16,
                      height: 16,
                      background: "#d4af37",
                      lineHeight: 1,
                    }}
                    data-testid="text-cart-count"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <button
              className="md:hidden text-white/70"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-16"
            style={{ background: "rgba(8,8,8,0.98)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} data-testid={`mobile-link-${link.label.toLowerCase()}`}>
                  <span
                    className="text-2xl tracking-widest uppercase cursor-pointer"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 300,
                      color: "rgba(212,175,55,0.9)",
                      letterSpacing: "0.25em",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="gold-line w-24 mt-4" />
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <span className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Login / Registro
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
