import { Link } from "wouter";
import { motion } from "framer-motion";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

const INSTAGRAM_URL = "https://www.instagram.com/rowgoldjoyeria/";
const WHATSAPP_URL = "https://wa.me/573213195879";
const TIKTOK_URL = "https://tiktok.com/@rowgold";
const GOLD = "#d4af37";

const socials = [
  { icon: SiInstagram, href: INSTAGRAM_URL, label: "Instagram", id: "instagram" },
  { icon: SiWhatsapp, href: WHATSAPP_URL, label: "WhatsApp", id: "whatsapp" },
  { icon: SiTiktok, href: TIKTOK_URL, label: "TikTok", id: "tiktok" },
];

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Colección" },
  { href: "/catalog?category=joyas", label: "Joyas" },
  { href: "/catalog?category=relojes", label: "Relojes" },
  { href: "/catalog?category=accesorios", label: "Accesorios" },
];

const categoryLinks = [
  { href: "/catalog?category=joyas&sub=anillos", label: "Anillos" },
  { href: "/catalog?category=joyas&sub=cadenas", label: "Cadenas" },
  { href: "/catalog?category=joyas&sub=pulseras", label: "Pulseras" },
  { href: "/catalog?category=joyas&sub=aretes", label: "Aretes" },
  { href: "/catalog?category=relojes", label: "Relojes" },
];

const supportLinks = [
  "Política de Privacidad",
  "Términos y Condiciones",
  "Devoluciones",
  "Envíos",
  "Contacto",
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden mt-24"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #080600 100%)",
        borderTop: "1px solid rgba(212,175,55,0.12)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "60%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "40%",
          height: 80,
          background: "radial-gradient(ellipse at top, rgba(212,175,55,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={rowgoldLogo}
                alt="ROWGOLD"
                style={{ width: 42, height: 42, objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(212,175,55,0.3))" }}
              />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  background: "linear-gradient(135deg, #a07808, #d4af37, #f5e06e, #d4af37)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ROWGOLD
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", maxWidth: 280 }}
            >
              Joyería y accesorios de lujo para quienes exigen lo mejor. Cada pieza es una obra de arte elaborada con los materiales más finos del mundo.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-${s.id}`}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    className="flex items-center justify-center transition-all duration-300"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "1px solid rgba(212,175,55,0.18)",
                      background: "rgba(212,175,55,0.04)",
                      color: "rgba(212,175,55,0.55)",
                    }}
                    title={s.label}
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, borderColor: GOLD }}
              className="inline-flex items-center gap-2.5 mt-7 px-5 py-2.5 transition-all duration-300"
              style={{
                border: "1px solid rgba(212,175,55,0.22)",
                color: "rgba(212,175,55,0.7)",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <SiWhatsapp size={13} />
              Contactar por WhatsApp
            </motion.a>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="mb-6 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(212,175,55,0.7)" }}>
              Navegación
            </h4>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: GOLD }}
                      className="text-sm cursor-pointer transition-colors block"
                      style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="mb-6 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(212,175,55,0.7)" }}>
              Categorías
            </h4>
            <ul className="space-y-3.5">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <motion.span
                      whileHover={{ x: 4, color: GOLD }}
                      className="text-sm cursor-pointer transition-colors block"
                      style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="mb-6 text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(212,175,55,0.7)" }}>
              Soporte
            </h4>
            <ul className="space-y-3.5">
              {supportLinks.map((item) => (
                <li key={item}>
                  <motion.span
                    whileHover={{ x: 4, color: GOLD }}
                    className="text-sm cursor-pointer transition-colors block"
                    style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}
                  >
                    {item}
                  </motion.span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mb-7"
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>
            &copy; {new Date().getFullYear()} ROWGOLD. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(212,175,55,0.3)" }}>
              Luxury Without Limits
            </p>
            <div style={{ width: 1, height: 12, background: "rgba(212,175,55,0.15)" }} />
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
              Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
