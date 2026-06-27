import { useState } from "react";
import { Link } from "wouter";
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
  { id: "privacy", label: "Política de Privacidad" },
  { href: "/terms", label: "Términos y Condiciones" },
  { href: "/returns", label: "Devoluciones" },
  { href: "/shipping", label: "Envíos" },
  { href: "/contact", label: "Contacto" },
];

export default function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">

          {/* Brand */}
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

            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em", maxWidth: 280 }}>
              Joyería y accesorios de lujo para quienes exigen lo mejor. Cada pieza es una obra de arte elaborada con los materiales más finos del mundo.
            </p>

            <div className="flex items-center gap-4">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center transition-all"
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
                  </a>
                );
              })}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-7 px-5 py-2.5 transition-all border"
              style={{
                borderColor: "rgba(212,175,55,0.22)",
                color: "rgba(212,175,55,0.7)",
                fontSize: "0.68rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              <SiWhatsapp size={13} />
              Contactar por WhatsApp
            </a>
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
                    <span className="text-sm cursor-pointer block transition-colors hover:text-[#d4af37]" style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}>
                      {link.label}
                    </span>
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
                    <span className="text-sm cursor-pointer block transition-colors hover:text-[#d4af37]" style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}>
                      {link.label}
                    </span>
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
                <li key={item.label}>
                  {item.id === "privacy" ? (
                    <button
                      type="button"
                      onClick={() => setIsPrivacyOpen(true)}
                      className="text-sm cursor-pointer block text-left bg-transparent border-0 p-0 outline-none w-full hover:text-[#d4af37]"
                      style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link href={item.href}>
                      <span className="text-sm cursor-pointer block transition-colors hover:text-[#d4af37]" style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em" }}>
                        {item.label}
                      </span>
                    </Link>
                  )}
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

      {/* ========================================================= */}
      {/* MODAL COMPLETAMENTE SEGURO CON Z-INDEX MÁXIMO (9999999) */}
      {/* ========================================================= */}
      {isPrivacyOpen && (
        <div 
          style={{ zIndex: 9999999 }} 
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          {/* Fondo para cerrar al dar clic afuera */}
          <div className="absolute inset-0" onClick={() => setIsPrivacyOpen(false)} />

          <div
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg p-6 md:p-8 border"
            style={{
              background: "#0a0a0a",
              borderColor: "rgba(212,175,55,0.25)",
              zIndex: 10000000
            }}
          >
            {/* Botón superior de cierre */}
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-4 right-4 text-xs tracking-widest uppercase text-white/50 bg-transparent border-0 cursor-pointer hover:text-[#d4af37]"
            >
              ✕ Cerrar
            </button>

            {/* Título Principal */}
            <h3 
              className="text-lg md:text-xl mb-6 tracking-wide pb-3 border-b uppercase text-left font-semibold" 
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: GOLD, borderColor: "rgba(212,175,55,0.15)" }}
            >
              Política de seguridad, privacidad y tratamiento de datos personales
            </h3>

            {/* Contenido Legal Completo */}
            <div className="text-sm space-y-5 leading-relaxed text-left pr-2 text-white/70">
              
              <p>
                En <strong>ROWGOLD</strong> reconocemos la importancia de la privacidad y la protección de la información personal de nuestros clientes. Por ello, tratamos los datos personales de conformidad con lo dispuesto en la Ley 1581 de 2012, el Decreto 1377 de 2013, el Decreto 1074 de 2015 y las demás normas que modifiquen, adicionen o sustituyan la legislación colombiana sobre protección de datos personales.
              </p>
              
              <p>
                Nuestro compromiso es garantizar una experiencia de compra segura, transparente y confiable, implementando medidas técnicas, administrativas y organizacionales orientadas a proteger la información suministrada por nuestros usuarios contra el acceso no autorizado, pérdida, alteración, divulgación, uso indebido o cualquier tratamiento contrario a la ley, toda la información personal recolectada por ROWGOLD será utilizada exclusivamente para gestionar pedidos, validar pagos, cotidianar envíos, atender solicitudes de garantía, brindar soporte al cliente, dar respuesta a peticiones, quejas o reclamos, cumplir obligaciones legales y mejorar la experiencia de compra, en ningún caso comercializaremos, venderemos o cederemos datos personales a terceros con fines distintos a los necesarios para la correcta prestación de nuestros servicios, salvo cuando exista autorización expresa del titular o una obligación legal que así lo requiera.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Seguridad en los pagos
              </h4>
              <p>
                Con el propósito de ofrecer transacciones seguras, ROWGOLD no almacena, procesa ni tiene acceso a la información completa de tarjetas de crédito o débito. Todos los pagos son gestionados mediante pasarelas de pago certificadas que utilizan protocolos de seguridad, cifrado de datos (SSL/TLS) y mecanismos de autenticación para proteger cada transacción realizada por nuestros clientes.
              </p>
              <p>
                Cuando el proceso de compra requiera coordinación mediante WhatsApp, la confirmación del pago se realizará únicamente a través del número oficial <strong>+57 321 319 5879</strong>, evitando intermediarios y reduciendo el riesgo de fraude.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Protección de la información
              </h4>
              <p>
                ROWGOLD implementa mecanismos de seguridad informática orientados a preservar la confidencialidad, integridad y disponibilidad de la información, nuestros sistemas cuentan con protocolos de cifrado de datos, controles de acceso y medidas de seguridad que buscan minimizar cualquier riesgo de acceso no autorizado o tratamiento indebido de la información suministrada por nuestros clientes.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Derechos del titular de los datos
              </h4>
              <p>
                De conformidad con la Ley 1581 de 2012, el titular de los datos personales podrá conocer, actualizar, rectificar o solicitar la eliminación de su información cuando sea procedente, así como revocar la autorización otorgada para su tratamiento y presentar consultas o reclamos relacionados con el uso de sus datos personales, las solicitudes serán atendidas a través de nuestros canales oficiales de contacto dentro de los términos establecidos por la legislación colombiana.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Garantía de nuestros productos
              </h4>
              <p>
                ROWGOLD comercializa joyas elaboradas en Plata Italiana Ley 925, Oro de 18 Kilates, Baño de Oro y relojes seleccionados bajo criterios de calidad.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-white/60">
                <li>Las joyas elaboradas en Plata Italiana Ley 925, Oro de 18 Kilates y Baño de Oro cuentan con una garantía de treinta (30) días calendario, exclusivamente por defectos de fabricación.</li>
                <li>Los relojes cuentan con una garantía de doce (12) meses, aplicable únicamente a defectos internos de maquinaria.</li>
              </ul>
              <p>
                La garantía no cubre daños ocasionados por golpes, caídas, manipulación inadecuada, contacto con perfumes, cremas, productos químicos, piscinas, agua salada, humedad excesiva, intervenciones realizadas por terceros, desgaste natural por el uso o cualquier situación derivada del uso indebido del producto.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Política de cambios
              </h4>
              <p>
                Como beneficio para nuestros clientes, ROWGOLD permitirá el cambio de los productos dentro de los trescientos sesenta y cinco (365) días calendario siguientes a la fecha de entrega, siempre que el producto se encuentre en perfectas condiciones, sin señales de uso, con su empaque original y conserve todas las etiquetas con las cuales fue entregado y sin daños o desgaste.
              </p>
              <p>
                Una vez recibido el producto, ROWGOLD verificará el cumplimiento de las condiciones anteriormente descritas antes de autorizar el cambio correspondiente.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Política de devoluciones y reembolsos
              </h4>
              <p>
                ROWGOLD no realiza devoluciones de dinero por motivos de gusto personal, cambio de opinión o errores atribuibles al comprador. Las devoluciones únicamente procederán cuando así lo disponga la legislación colombiana aplicable, incluyendo el ejercicio del derecho de retracto cuando corresponda, o cuando exista un defecto cubierto por la garantía legal que no pueda ser solucionado mediante reparación o sustitución del producto, conforme a lo establecido en la Ley 1480 de 2011 (Estatuto del Consumidor).
              </p>
              <p>
                Las solicitudes relacionadas con garantías, cambios o reembolsos deberán presentarse a través de los canales oficiales de atención.
              </p>

              <h4 style={{ color: GOLD }} className="uppercase text-xs pt-2 font-bold tracking-wider">
                Canales oficiales de atención
              </h4>
              <ul className="space-y-1.5 text-white/60">
                <li><strong>Sitio web:</strong> <a href="https://rowgold-store.onrender.com" target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">https://rowgold-store.onrender.com</a></li>
                <li><strong>Correo electrónico:</strong> rowgold06joyeria@gmail.com</li>
                <li><strong>WhatsApp oficial:</strong> +57 321 319 5879</li>
                <li><strong>Horario de atención:</strong> Lunes a domingo, de 7:00 a. m. a 11:59 p. m., a través del sitio web, WhatsApp o Instagram “rowgoldjoyeria”.</li>
              </ul>
            </div>

            {/* Botón inferior de cierre */}
            <div className="mt-6 flex justify-end border-t pt-4" style={{ borderColor: "rgba(212,175,55,0.1)" }}>
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="px-6 py-2 text-xs uppercase tracking-widest transition-all cursor-pointer text-[#d4af37]"
                style={{
                  border: "1px solid rgba(212,175,55,0.3)",
                  background: "rgba(212,175,55,0.02)"
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
