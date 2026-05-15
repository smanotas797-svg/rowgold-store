import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import rowgoldLogo from "@assets/WhatsApp_Image_2026-05-14_at_9.43.54_PM_1778817269857.jpeg";

const GOLD = "#d4af37";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Las contrasenas no coinciden", path: ["confirm"] });
type FormData = z.infer<typeof schema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState("");
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      await registerUser(data.email, data.password, data.name);
      setLocation("/");
    } catch {
      setError("Este email ya esta registrado.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060606 0%, #0f0c00 50%, #060606 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <img src={rowgoldLogo} alt="ROWGOLD" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.1em",
            }}
          >
            Crear Cuenta
          </h1>
          <p className="text-xs tracking-widest mt-2" style={{ color: "rgba(212,175,55,0.5)" }}>
            ROWGOLD LUXURY
          </p>
        </div>

        <div className="luxury-card p-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {[
              { name: "name" as const, label: "Nombre Completo", type: "text", placeholder: "Juan Garcia" },
              { name: "email" as const, label: "Email", type: "email", placeholder: "tu@email.com" },
              { name: "password" as const, label: "Contrasena", type: "password", placeholder: "••••••••" },
              { name: "confirm" as const, label: "Confirmar Contrasena", type: "password", placeholder: "••••••••" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-[10px] tracking-widest uppercase mb-2" style={{ color: "rgba(212,175,55,0.5)" }}>
                  {field.label}
                </label>
                <input
                  {...form.register(field.name)}
                  type={field.type}
                  placeholder={field.placeholder}
                  data-testid={`input-${field.name}`}
                  className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                  style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(255,255,255,0.8)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)")}
                />
                {form.formState.errors[field.name] && (
                  <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                    {(form.formState.errors[field.name] as { message?: string })?.message}
                  </p>
                )}
              </div>
            ))}

            {error && <p className="text-xs text-center" style={{ color: "#ef4444" }}>{error}</p>}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={form.formState.isSubmitting}
              data-testid="button-register-submit"
              className="w-full py-4 text-xs tracking-[0.25em] uppercase font-semibold disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg, #b8960c, #d4af37, #b8960c)", color: "#080808" }}
            >
              {form.formState.isSubmitting ? "Registrando..." : "Crear Cuenta"}
            </motion.button>
          </form>

          <div className="gold-line mt-8 mb-6" />

          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
            Ya tienes cuenta?{" "}
            <Link href="/login">
              <span className="cursor-pointer hover:underline" style={{ color: GOLD }}>
                Inicia sesion
              </span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
