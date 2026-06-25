import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { SiInstagram, SiWhatsapp } from "react-icons/si";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

const INSTAGRAM_URL = "https://www.instagram.com/rowgoldjoyeria?utm_source=qr";
const WHATSAPP_URL = "https://wa.me/573213195879";
const GOLD = "#d4af37";

type NavChild = { href: string; label: string };
type NavLink =
  | { href: string; label: string; children?: undefined }
  | { href?: undefined; label: string; children: NavChild[] };

const navLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Colección" },
  {
    label: "Joyería",
    children: [
      { href: "/catalog?category=joyas&sub=anillos", label: "Anillos" },
      { href: "/catalog?category=joyas&sub=cadenas", label: "Cadenas" },
      { href: "/catalog?category=joyas&sub=pulseras", label: "Pulseras" },
      { href: "/catalog?category=joyas&sub=aretes", label: "Aretes" },
    ],
  },
  { href: "/catalog?category=relojes", label: "Relojes" },
  { href: "/catalog?category=accesorios", label: "Accesorios" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(6,6,6,0.94)"
            : "linear-gradient(180deg, rgba(6,6,6,0.85) 0%, rgba(6,6,6,0.0) 100%)",
          borderBottom: scrolled ? "1px solid rgba(212,175,55,0.18)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(160%)" : "blur(8px)",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(160%)" : "blur(8px)",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: scrolled
              ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)"
              : "transparent",
            transition: "background 0.5s ease",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" data-testid="link-home-logo">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={rowgoldLogo}
                  alt="ROWGOLD"
                  style={{
                    width: 38,
                    height: 38,
                    objectFit: "contain",
                    filter: "brightness(1.05) drop-shadow(0 0 8px rgba(212,175,55,0.3))",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.55rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  background: "linear-gradient(135deg, #a07808 0%, #d4af37 35%, #f5e06e 55%, #d4af37 75%, #a07808 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}
              >
                ROWGOLD
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              if ("children" in link) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <motion.button
                      className="flex items-center gap-1 cursor-pointer transition-colors"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: 400,
                        letterSpacing: "0.15em",
                        fontSize: "0.68rem",
                        textTransform: "uppercase",
                        background: "transparent",
                        border: "none",
                      }}
                      whileHover={{ color: GOLD } as any}
                    >
                      {link.label}
                      <ChevronDown size={10} style={{ opacity: 0.6, marginTop: 1 }} />
                    </motion.button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scaleY: 0.9 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: 6, scaleY: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 pt-3"
                          style={{ transformOrigin: "top" }}
                        >
                          <div
                            className="py-2"
                            style={{
                              background: "rgba(6,6,6,0.97)",
                              border: "1px solid rgba(212,175,55,0.18)",
                              backdropFilter: "blur(24px)",
                              boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
                              minWidth: 160,
                            }}
                          >
                            {link.children!.map((child) => (
                              <Link key={child.label} href={child.href} onClick={() => setDropdownOpen(false)}>
                                <motion.div
                                  whileHover={{ x: 4, color: GOLD }}
                                  className="px-5 py-2.5 text-xs tracking-[0.12em] uppercase cursor-pointer transition-colors"
                                  style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em" }}
                                >
                                  {child.label}
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link key={link.label} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                  <motion.span
                    className="relative cursor-pointer transition-colors pb-0.5"
                    style={{
                      color: location === link.href ? GOLD : "rgba(255,255,255,0.6)",
                      fontWeight: 400,
                      letterSpacing: "0.15em",
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                    }}
                    whileHover={{ color: GOLD } as any}
                  >
                    {link.label}
                    {location === link.href && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[1px]"
                        style={{ background: GOLD }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Social icons desktop */}
            <div className="hidden lg:flex items-center gap-3.5 mr-1">
              <motion.a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: GOLD }}
                style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.3s" }}
              >
                <SiInstagram size={15} />
              </motion.a>
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: GOLD }}
                style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.3s" }}
              >
                <SiWhatsapp size={15} />
              </motion.a>
              <div style={{ width: 1, height: 14, background: "rgba(212,175,55,0.2)" }} />
            </div>

            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/profile" data-testid="link-profile">
                  <motion.span
                    whileHover={{ color: GOLD }}
                    className="text-xs tracking-wider cursor-pointer transition-colors"
                    style={{ color: "rgba(212,175,55,0.6)" }}
                  >
                    {user.username}
                  </motion.span>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" data-testid="link-admin">
                    <span className="text-xs tracking-[0.15em] uppercase cursor-pointer" style={{ color: "rgba(212,175,55,0.7)" }}>
                      Admin
                    </span>
                  </Link>
                )}
                <motion.button
                  onClick={logout}
                  data-testid="button-logout"
                  whileHover={{ color: GOLD }}
                  style={{ color: "rgba(255,255,255,0.35)", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <LogOut size={14} />
                </motion.button>
              </div>
            ) : (
              <Link href="/login" data-testid="link-login" className="hidden lg:block">
                <motion.div whileHover={{ scale: 1.1, color: GOLD }} style={{ color: "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>
                  <User size={17} />
                </motion.div>
              </Link>
            )}

            <Link href="/cart" data-testid="link-cart">
              <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
                <ShoppingBag size={19} style={{ color: "rgba(255,255,255,0.65)", transition: "color 0.3s" }} className="hover:text-amber-400" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex items-center justify-center text-black text-[9px] font-bold"
                    style={{
                      width: 16,
                      height: 16,
                      background: "linear-gradient(135deg, #b8960c, #d4af37)",
                      borderRadius: "50%",
                    }}
                    data-testid="text-cart-count"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <motion.button
              className="lg:hidden cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-menu-toggle"
              whileTap={{ scale: 0.9 }}
              style={{ color: "rgba(255,255,255,0.7)", background: "transparent", border: "none" }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 pt-[68px]"
            style={{ background: "rgba(4,4,4,0.99)", backdropFilter: "blur(28px)" }}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex flex-col items-center justify-center flex-1 gap-1 py-10">
                {navLinks.map((link, i) => {
                  if ("children" in link) {
                    return (
                      <div key={link.label} className="w-full max-w-xs">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i }}
                          className="text-center py-4 text-xs tracking-[0.3em] uppercase"
                          style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.3em" }}
                        >
                          {link.label}
                        </motion.div>
                        {link.children!.map((child, j) => (
                          <Link key={child.label} href={child.href} onClick={() => setMobileOpen(false)}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * i + 0.03 * j }}
                              className="text-center py-3 cursor-pointer"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "1.3rem",
                                fontWeight: 300,
                                color: "rgba(255,255,255,0.7)",
                                letterSpacing: "0.15em",
                              }}
                            >
                              {child.label}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)} data-testid={`mobile-link-${link.label.toLowerCase()}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * i }}
                        whileHover={{ x: 6, color: GOLD }}
                        className="py-5 px-8 cursor-pointer text-center"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.7rem",
                          fontWeight: 300,
                          color: "rgba(212,175,55,0.85)",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                        }}
                      >
                        {link.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile bottom bar */}
              <div className="border-t pb-10 pt-8 px-8" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                <div className="gold-line mb-8" />
                <div className="flex items-center justify-center gap-8 mb-6">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ scale: 1.15 }} style={{ color: "rgba(212,175,55,0.6)" }}>
                      <SiInstagram size={22} />
                    </motion.div>
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{ scale: 1.15 }} style={{ color: "rgba(212,175,55,0.6)" }}>
                      <SiWhatsapp size={22} />
                    </motion.div>
                  </a>
                </div>
                {user ? (
                  <div className="flex gap-6 justify-center">
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <div className="text-center text-xs tracking-[0.2em] uppercase cursor-pointer" style={{ color: "rgba(212,175,55,0.6)" }}>
                        Mi Perfil
                      </div>
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="text-center text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.25)", background: "transparent", border: "none" }}>
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <div className="text-center text-xs tracking-[0.2em] uppercase cursor-pointer" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Login / Registro
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
