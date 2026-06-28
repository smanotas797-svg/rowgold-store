import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";
import { IoCloseOutline } from "react-icons/io5";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

const INSTAGRAM_URL = "https://www.instagram.com/rowgoldjoyeria?utm_source=qr";
const WHATSAPP_URL = "https://wa.me/573213195879";
const TIKTOK_URL = "www.tiktok.com/@rowgold.joyeria";
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
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Helper para abrir el modal desde los links de soporte correspondientes
  const handleSupportClick = (item: string) => {
    if (
      item === "Política de Privacidad" || 
      item === "Términos y Condiciones" || 
      item === "Devoluciones" || 
      item === "Envíos"
    ) {
      setIsPrivacyOpen(true);
    } else if (item === "Contacto") {
      window.open(WHATSAPP_URL, "_blank");
    }
  };

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
                    onClick={() => handleSupportClick(item)}
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
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>
              &copy; {new Date().getFullYear()} ROWGOLD. Todos los derechos reservados.
            </p>
          </div>
          
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

      {/* MODAL MUESTRA POLÍTICAS Y CONDICIONES LEGALES */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPrivacyOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl p-6 md:p-8 border scrollbar-thin scrollbar-thumb-white/10"
              style={{
                background: "#050505",
                borderColor: "rgba(212,175,55,0.2)",
                boxShadow: "0 10px 50px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.03)",
              }}
            >
              {/* Botón Cerrar */}
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/5 z-10"
              >
                <IoCloseOutline size={22} />
              </button>

              {/* Título Principal */}
              <h3 
                className="mb-6 text-xl md:text-2xl font-semibold tracking-wide border-b pb-4 pr-8"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: GOLD,
                  borderColor: "rgba(212,175,55,0.15)"
                }}
              >
                Términos, Privacidad y Políticas Comerciales
              </h3>

              {/* Contenido Legal */}
              <div className="space-y-5 text-xs md:text-sm text-neutral-300 leading-relaxed font-sans pr-1">
                
                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    1. Política de Seguridad, Privacidad y Tratamiento de Datos Personales
                  </h4>
                  <p>
                    En ROWGOLD reconocemos la importancia de la privacidad y la protección de la información personal de nuestros clientes. Por ello, tratamos los datos personales de conformidad con lo dispuesto en la <strong>Ley 1581 de 2012, el Decreto 1377 de 2013, el Decreto 1074 de 2015</strong> y las demás normas que modifiquen, adicionen o sustituyan la legislación colombiana sobre protección de datos personales.
                  </p>
                  <p className="mt-2">
                    Nuestro compromiso es garantizar una experiencia de compra segura, transparente y confiable, implementando medidas técnicas, administrativas y organizacionales orientadas a proteger la información suministrada por nuestros usuarios contra el acceso no autorizado, pérdida, alteración, divulgación, uso indebido o cualquier tratamiento contrario a la ley. Toda la información personal recolectada por ROWGOLD será utilizada exclusivamente para gestionar pedidos, validar pagos, coordinar envíos, atender solicitudes de garantía, brindar soporte al cliente, dar respuesta a peticiones, quejas o reclamos, cumplir obligaciones legales y mejorar la experiencia de compra. En ningún caso comercializaremos, venderemos o cederemos datos personales a terceros con fines distintos a los necesarios para la correcta prestación de nuestros servicios, salvo cuando exista autorización expresa del titular o una obligación legal que así lo requiera.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    2. Seguridad en los Pagos
                  </h4>
                  <p>
                    Con el propósito de ofrecer transacciones seguras, ROWGOLD no almacena, procesa ni tiene acceso a la información completa de tarjetas de crédito o débito. Todos los pagos son gestionados mediante pasarelas de pago certificadas que utilizan protocolos de seguridad, cifrado de datos (SSL/TLS) y mecanismos de autenticación para proteger cada transacción realizada por nuestros clientes.
                  </p>
                  <p className="mt-2">
                    Cuando el proceso de compra requiera coordinación mediante WhatsApp, la confirmación del pago se realizará únicamente a través del número oficial <strong>+57 321 319 5879</strong>, evitando intermediarios y reduciendo el riesgo de fraude.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    3. Protección de la Información
                  </h4>
                  <p>
                    ROWGOLD implementa mecanismos de seguridad informática orientados a preservar la confidencialidad, integridad y disponibilidad de la información. Nuestros sistemas cuentan con protocolos de cifrado de datos, controles de acceso y medidas de seguridad que buscan minimizar cualquier riesgo de acceso no autorizado o tratamiento indebido de la información suministrada por nuestros clientes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    4. Derechos del Titular de los Datos
                  </h4>
                  <p>
                    De conformidad con la Ley 1581 de 2012, el titular de los datos personales podrá conocer, actualizar, rectificar o solicitar la eliminación de su información cuando sea procedente, así como revocar la autorización otorgada para su tratamiento y presentar consultas o reclamos relacionados con el uso de sus datos personales. Las solicitudes serán atendidas a través de nuestros canales oficiales de contacto dentro de los términos establecidos por la legislación colombiana.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    5. Garantía de nuestros Productos
                  </h4>
                  <p>
                    ROWGOLD comercializa joyas elaboradas en Plata Italiana Ley 925, Oro de 18 Kilates, Baño de Oro y relojes seleccionados bajo criterios de calidad.
                  </p>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1">
                    <li>Las joyas de Plata Italiana Ley 925, Oro de 18 Kilates y Baño de Oro cuentan con una garantía de <strong>treinta (30) días calendario</strong>, exclusivamente por defectos de fabricación.</li>
                    <li>Los relojes cuentan con una garantía de <strong>doce (12) meses</strong>, aplicable únicamente a defectos internos de maquinaria.</li>
                  </ul>
                  <p className="mt-2 text-neutral-400 italic">
                    La garantía no cubre daños ocasionados por golpes, caídas, manipulación inadecuada, contacto con perfumes, cremas, productos químicos, piscinas, agua salada, humedad excesiva, intervenciones realizadas por terceros, desgaste natural por el uso o cualquier situación derivada del uso indebido del producto.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    6. Política de Cambios
                  </h4>
                  <p>
                    Como beneficio para nuestros clientes, ROWGOLD permitirá el cambio de los productos dentro de los <strong>trescientos sesenta y cinco (365) días calendario</strong> siguientes a la fecha de entrega, siempre que el producto se encuentre en perfectas condiciones, sin señales de uso, con su empaque original y conserve todas las etiquetas con las cuales fue entregado y sin daños o desgaste. Una vez recibido el producto, ROWGOLD verificará el cumplimiento de las condiciones anteriormente descritas antes de autorizar el cambio correspondiente.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-1.5" style={{ color: GOLD }}>
                    7. Política de Devoluciones y Reembolsos
                  </h4>
                  <p>
                    ROWGOLD no realiza devoluciones de dinero por motivos de gusto personal, cambio de opinión o errores atribuibles al comprador. Las devoluciones únicamente procederán cuando así lo disponga la legislación colombiana aplicable, incluyendo el ejercicio del derecho de retracto cuando corresponda, o cuando exista un defecto cubierto por la garantía legal que no pueda ser solucionado mediante reparación o sustitución del producto, conforme a lo establecido en la <strong>Ley 1480 de 2011 (Estatuto del Consumidor)</strong>.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-1 text-xs text-neutral-400">
                  <p className="font-medium text-white">Canales Oficiales de Atención:</p>
                  <p>• Sitio web: <span style={{ color: GOLD }}>https://rowgold-store.onrender.com</span></p>
                  <p>• Correo electrónico: rowgold06joyeria@gmail.com</p>
                  <p>• WhatsApp oficial: +57 321 319 5879</p>
                  <p className="mt-2">
                    <strong className="text-white">Horario:</strong> Lunes a domingo, de 7:00 a. m. a 11:59 p. m., a través del sitio web, WhatsApp o Instagram "@rowgoldjoyeria".
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
