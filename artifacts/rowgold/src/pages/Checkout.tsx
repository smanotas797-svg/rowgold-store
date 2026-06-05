import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { sessionId } from "@/contexts/CartContext";
import { Shield, Check } from "lucide-react";

const GOLD = "#d4af37";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email invalido"),
  address: z.string().min(10, "Direccion completa requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  country: z.string().min(2, "Pais requerido"),
  paymentMethod: z.enum([
    "mercadopago",
    "paypal",
    "stripe",
    "transferencia",
    "contra_entrega",
  ]),
});

type FormData = z.infer<typeof schema>;

const paymentMethods = [
  { value: "mercadopago", label: "MercadoPago" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
  { value: "transferencia", label: "Transferencia Bancaria" },
  { value: "contra_entrega", label: "Pago contra Entrega" },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart } = useCart();
  const [success, setSuccess] = useState(false);
  const createOrder = useCreateOrder({
    request: { headers: { "x-session-id": sessionId } },
  } as Parameters<typeof useCreateOrder>[0]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "stripe" },
  });

  const onSubmit = async (data: FormData) => {
    const address = `${data.name}, ${data.address}, ${data.city}, ${data.country}`;
    createOrder.mutate(
      { data: { shippingAddress: address, paymentMethod: data.paymentMethod } },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => setLocation("/orders"), 3000);
        },
      },
    );
  };

  if (success) {
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: "#080808" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
            style={{
              border: `2px solid ${GOLD}`,
              background: "rgba(212,175,55,0.05)",
            }}
          >
            <Check size={36} style={{ color: GOLD }} />
          </motion.div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Pedido Confirmado
          </h2>
          <p
            className="mt-4 text-sm"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Redirigiendo a tus pedidos...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-20 px-6"
      style={{ background: "#080808" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: GOLD }}
          >
            Ultimo Paso
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "0.06em",
            }}
          >
            Checkout
          </h1>
          <div className="gold-line w-16 mt-4" />
        </motion.div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="luxury-card p-8">
                <h3
                  className="mb-6 text-xs tracking-[0.25em] uppercase"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                >
                  Informacion de Envio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      name: "name" as const,
                      label: "Nombre Completo",
                      placeholder: "Juan Garcia",
                    },
                    {
                      name: "email" as const,
                      label: "Email",
                      placeholder: "juan@email.com",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        className="block text-[10px] tracking-widest uppercase mb-2"
                        style={{ color: "rgba(212,175,55,0.5)" }}
                      >
                        {field.label}
                      </label>
                      <input
                        {...form.register(field.name)}
                        placeholder={field.placeholder}
                        data-testid={`input-${field.name}`}
                        className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                        style={{
                          border: "1px solid rgba(212,175,55,0.2)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(212,175,55,0.5)")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(212,175,55,0.2)")
                        }
                      />
                      {form.formState.errors[field.name] && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#ef4444" }}
                        >
                          {form.formState.errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label
                      className="block text-[10px] tracking-widest uppercase mb-2"
                      style={{ color: "rgba(212,175,55,0.5)" }}
                    >
                      Direccion
                    </label>
                    <input
                      {...form.register("address")}
                      placeholder="Calle, Numero, Colonia"
                      data-testid="input-address"
                      className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                      style={{
                        border: "1px solid rgba(212,175,55,0.2)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(212,175,55,0.5)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(212,175,55,0.2)")
                      }
                    />
                    {form.formState.errors.address && (
                      <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                  {[
                    {
                      name: "city" as const,
                      label: "Ciudad",
                      placeholder: "Ciudad de Mexico",
                    },
                    {
                      name: "country" as const,
                      label: "Pais",
                      placeholder: "Mexico",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        className="block text-[10px] tracking-widest uppercase mb-2"
                        style={{ color: "rgba(212,175,55,0.5)" }}
                      >
                        {field.label}
                      </label>
                      <input
                        {...form.register(field.name)}
                        placeholder={field.placeholder}
                        data-testid={`input-${field.name}`}
                        className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                        style={{
                          border: "1px solid rgba(212,175,55,0.2)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(212,175,55,0.5)")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.borderColor =
                            "rgba(212,175,55,0.2)")
                        }
                      />
                      {form.formState.errors[field.name] && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#ef4444" }}
                        >
                          {form.formState.errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="luxury-card p-8">
                <h3
                  className="mb-6 text-xs tracking-[0.25em] uppercase"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                >
                  Metodo de Pago
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center gap-4 p-4 cursor-pointer transition-all"
                      style={{ border: "1px solid rgba(212,175,55,0.15)" }}
                      data-testid={`payment-${method.value}`}
                    >
                      <input
                        type="radio"
                        {...form.register("paymentMethod")}
                        value={method.value}
                        className="hidden"
                      />
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          border: `1px solid ${form.watch("paymentMethod") === method.value ? GOLD : "rgba(212,175,55,0.3)"}`,
                        }}
                      >
                        {form.watch("paymentMethod") === method.value && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: GOLD }}
                          />
                        )}
                      </div>
                      <span
                        className="text-sm"
                        style={{
                          color:
                            form.watch("paymentMethod") === method.value
                              ? GOLD
                              : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="luxury-card p-8">
                <h3
                  className="mb-6 text-xs tracking-[0.25em] uppercase"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                >
                  Tu Pedido
                </h3>
                <div className="space-y-3 mb-6">
                  {(cart?.items ?? []).map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>
                        $
                        {(
                          (item.product.price || 0) * (item.quantity || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="gold-line mb-4" />
                <div className="space-y-2 mb-6">
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <span>Subtotal</span>
                    <span>${(cart?.subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <span>Envio</span>
                    <span>
                      {(cart?.shipping ?? 0) === 0
                        ? "Gratis"
                        : `$${cart?.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.3rem",
                        color: GOLD,
                      }}
                    >
                      ${(cart?.total ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={createOrder.isPending}
                  data-testid="button-place-order"
                  className="w-full py-4 text-xs tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #b8960c, #d4af37, #b8960c)",
                    color: "#080808",
                  }}
                >
                  {createOrder.isPending ? "Procesando..." : "Confirmar Pedido"}
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield size={12} style={{ color: "rgba(212,175,55,0.4)" }} />
                  <p
                    className="text-[10px] tracking-wider"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Pago seguro y encriptado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
