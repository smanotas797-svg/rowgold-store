import { Link } from "wouter";
import { motion } from "framer-motion";

const GOLD = "#d4af37";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#080808" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "8rem",
            fontWeight: 300,
            color: "rgba(212,175,55,0.08)",
            lineHeight: 1,
            letterSpacing: "0.1em",
          }}
        >
          404
        </p>
        <h1
          className="-mt-4 mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2rem",
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.1em",
          }}
        >
          Pagina no encontrada
        </h1>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)", width: 120, margin: "0 auto 2rem" }} />
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="px-10 py-4 text-xs tracking-[0.25em] uppercase"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
            data-testid="button-go-home"
          >
            Volver al Inicio
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
