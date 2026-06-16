import { createContext, useContext, useCallback } from "react";
import {
  useGetCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
  getGetCartQueryKey,
  type Cart,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

const SESSION_KEY = "rowgold-session-id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "rowgold-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export const sessionId = getOrCreateSessionId();

interface CartContextValue {
  cart: Cart | undefined;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();

  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useClearCart();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
  }, [queryClient]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    addMutation.mutate({ data: { productId, quantity } }, { onSuccess: invalidate });
  }, [addMutation, invalidate]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    updateMutation.mutate({ productId, data: { quantity } }, { onSuccess: invalidate });
  }, [updateMutation, invalidate]);

  const removeItem = useCallback((productId: number) => {
    removeMutation.mutate({ productId }, { onSuccess: invalidate });
  }, [removeMutation, invalidate]);

  const clearCart = useCallback(() => {
    clearMutation.mutate(undefined as never, { onSuccess: invalidate });
  }, [clearMutation, invalidate]);

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount: cart?.itemCount ?? 0,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
