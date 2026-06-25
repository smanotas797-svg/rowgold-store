import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SiInstagram, SiWhatsapp } from "react-icons/si";

const INSTAGRAM_URL = "https://www.instagram.com/rowgoldjoyeria?utm_source=qr";
const WHATSAPP_URL = "https://wa.me/573213195879";
const GOLD = "#d4af37";

export default function SocialFloatingButtons() {
  const [hovered, setHovered] = useState<string | null>(null);

  const buttons = [
    {
      id: "instagram",
      icon: SiInstagram,
      href: INSTAGRAM_URL,
      label: "Instagram",
      gradient: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
    },
    {
      id: "whatsapp",
      icon: SiWhatsapp,
      href: WHATSAPP_URL,
      label: "WhatsApp",
      gradient: "linear-gradient(135deg, #25d366, #128c7e)",
    },
  ];

  return (
    <div
      className="fixed right-5 bottom-8 z-50 flex flex-col gap-3 items-end"
      data-testid="social-floating-buttons"
    >
      {buttons.map((btn, i) => {
        const Icon = btn.icon;
        const isHovered = hovered === btn.id;
        return (
          <motion.div
            key={btn.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-0"
          >
            {/* Label pill */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 10, scaleX: 0.8 }}
                  animate={{ opacity: 1, x: 0, scaleX: 1 }}
                  exit={{ opacity: 0, x: 8, scaleX: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="mr-3 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium whitespace-nowrap"
                  style={{
                    background: "rgba(8,8,8,0.92)",
                    border: `1px solid rgba(212,175,55,0.3)`,
                    color: GOLD,
                    backdropFilter: "blur(10px)",
                    borderRadius: "2px",
                  }}
                >
                  {btn.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Button */}
            <motion.a
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`button-social-${btn.id}`}
              onHoverStart={() => setHovered(btn.id)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ scale: 1.12, rotate: 3 }}
              whileTap={{ scale: 0.92 }}
              className="flex items-center justify-center cursor-pointer relative"
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: isHovered ? btn.gradient : "rgba(8,8,8,0.9)",
                border: `1px solid ${isHovered ? "transparent" : "rgba(212,175,55,0.25)"}`,
                backdropFilter: "blur(12px)",
                boxShadow: isHovered
                  ? "0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.15)"
                  : "0 4px 16px rgba(0,0,0,0.5)",
                transition: "background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isHovered ? "#fff" : GOLD,
                  transition: "color 0.3s ease",
                }}
              />

              {/* Gold ring pulse when not hovered */}
              {!isHovered && (
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: "50%" }}
                />
              )}
            </motion.a>
          </motion.div>
        );
      })}
    </div>
  );
}
