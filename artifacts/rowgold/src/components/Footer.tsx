import { Link } from "wouter";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#060606",
        borderTop: "1px solid rgba(212,175,55,0.15)",
      }}
      className="mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={rowgoldLogo} alt="ROWGOLD" style={{ width: 40, height: 40, objectFit: "contain" }} />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  background: "linear-gradient(135deg, #b8960c, #d4af37, #f5e06e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ROWGOLD
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.03em" }}
            >
              Joyeria y accesorios de lujo para quienes exigen lo mejor. Cada pieza es una obra de arte.
            </p>
            <div className="flex items-center gap-5 mt-8">
              <a
                href="#"
                data-testid="link-instagram"
                className="text-white/30 hover:text-amber-400 transition-colors"
              >
                <SiInstagram size={18} />
              </a>
              <a
                href="#"
                data-testid="link-tiktok"
                className="text-white/30 hover:text-amber-400 transition-colors"
              >
                <SiTiktok size={18} />
              </a>
              <a
                href="#"
                data-testid="link-whatsapp"
                className="text-white/30 hover:text-amber-400 transition-colors"
              >
                <SiWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              className="mb-6 text-xs tracking-widest uppercase"
              style={{ color: "rgba(212,175,55,0.8)", letterSpacing: "0.2em" }}
            >
              Navegacion
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalog", label: "Catalogo" },
                { href: "/catalog?category=joyas", label: "Joyas" },
                { href: "/catalog?category=relojes", label: "Relojes" },
                { href: "/catalog?category=accesorios", label: "Accesorios" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span
                      className="text-sm cursor-pointer hover:text-amber-400 transition-colors"
                      style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="mb-6 text-xs tracking-widest uppercase"
              style={{ color: "rgba(212,175,55,0.8)", letterSpacing: "0.2em" }}
            >
              Soporte
            </h4>
            <ul className="space-y-3">
              {[
                "Politica de Privacidad",
                "Terminos y Condiciones",
                "Devoluciones",
                "Envios",
                "Contacto",
              ].map((item) => (
                <li key={item}>
                  <span
                    className="text-sm cursor-pointer hover:text-amber-400 transition-colors"
                    style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gold-line mt-12 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            &copy; 2024 ROWGOLD. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: "rgba(212,175,55,0.3)", letterSpacing: "0.1em" }}>
            LUXURY WITHOUT LIMITS
          </p>
        </div>
      </div>
    </footer>
  );
}
