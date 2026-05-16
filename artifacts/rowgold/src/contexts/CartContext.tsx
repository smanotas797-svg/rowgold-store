import { createContext, useContext, useCallback } from "react";
import { useGetCart, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react";
import type { Cart } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const ROWGOLD_SESSION = "rowgold-session-" + Math.random().toString(36).slice(2);

function getSessionId(): string {
  const stored = localStorage.getItem("rowgold-session-id");
  if (stored) return stored;
  localStorage.setItem("rowgold-session-id", ROWGOLD_SESSION);
  return ROWGOLD_SESSION;
}

export const sessionId = getSessionId();

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

const requestOptions = {
  headers: { "x-session-id": sessionId },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: rawCart, isLoading } = useGetCart({
    query: {
      queryKey: getGetCartQueryKey(),
    },
    request: requestOptions,
  } as Parameters<typeof useGetCart>[0]);
  const cart = rawCart as Cart | undefined;

  const addMutation = useAddToCart({ request: requestOptions } as Parameters<typeof useAddToCart>[0]);
  const updateMutation = useUpdateCartItem({ request: requestOptions } as Parameters<typeof useUpdateCartItem>[0]);
  const removeMutation = useRemoveFromCart({ request: requestOptions } as Parameters<typeof useRemoveFromCart>[0]);
  const clearMutation = useClearCart({ request: requestOptions } as Parameters<typeof useClearCart>[0]);

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
