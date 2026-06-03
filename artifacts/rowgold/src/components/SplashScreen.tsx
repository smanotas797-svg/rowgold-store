import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  delay: number;
  opacity: number;
}

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 4 + 3,
      drift: (Math.random() - 0.5) * 60,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.6 + 0.3,
    }));
    setParticles(ps);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 700);
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#080808" }}
        >
          {/* Gold particles */}
          {particles.map((p: any) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                background: "#d4af37",
                boxShadow: "0 0 6px rgba(212,175,55,0.8)",
                opacity: p.opacity,
              }}
              animate={{
                y: [window.innerHeight, -50],
                x: [0, p.drift],
                opacity: [0, p.opacity, p.opacity * 0.5, 0],
              }}
              transition={{
                duration: p.speed,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Radial gold glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute"
            style={{
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 40%, transparent 70%)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3, 0.7, 0.4] }}
                transition={{
                  duration: 2,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
                  filter: "blur(20px)",
                  transform: "scale(1.5)",
                }}
              />
              <img
                src={rowgoldLogo}
                alt="ROWGOLD"
                style={{
                  width: 280,
                  height: 280,
                  objectFit: "contain",
                  filter:
                    "drop-shadow(0 0 20px rgba(212,175,55,0.5)) drop-shadow(0 0 40px rgba(212,175,55,0.2))",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center"
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.4em",
                  color: "rgba(212,175,55,0.7)",
                  textTransform: "uppercase",
                  fontWeight: 300,
                }}
              >
                Luxury Without Limits
              </p>
            </motion.div>
          </motion.div>

          {/* Bottom loading bar */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div
              style={{
                width: 180,
                height: 1,
                background: "rgba(212,175,55,0.2)",
                borderRadius: 1,
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: "#d4af37",
                  borderRadius: 1,
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "linear", delay: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
