import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";

const SESSION_KEY = "rowgold-session-id";

function createSessionId(): string {
  return "rowgold-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = createSessionId();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export const sessionId = getOrCreateSessionId();

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-session-id": sessionId,
  };
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch("/api" + path, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string> | undefined) },
  });
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
  return json as T;
}

export type User = {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  category: string;
  subcategory: string | null;
  imageUrl: string | null;
  images: string[];
  featured: boolean;
  inStock: boolean;
  stockQuantity: number | null;
  material: string | null;
  weight: string | null;
  collection: string | null;
  rating: number | null;
  reviewCount: number | null;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export type CartItem = {
  productId: number;
  quantity: number;
  product: Product;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
};

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};

export type StatusHistoryEntry = {
  status: string;
  timestamp: string;
  note?: string;
};

export type Order = {
  id: number;
  sessionId: string | null;
  userId: number | null;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string | null;
  paymentMethod: string | null;
  trackingNumber: string | null;
  estimatedDelivery: string | null;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: number;
  productId: number;
  authorName: string;
  authorEmail: string | null;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  createdAt: string;
};

export type CatalogStats = {
  totalProducts: number;
  totalCategories: number;
  featuredCount: number;
  byCategory: Array<{ category: string; count: number }>;
};

export const getGetCartQueryKey = () => ["cart"] as const;
export const getGetMeQueryKey = () => ["me"] as const;
export const getListProductsQueryKey = () => ["products"] as const;
export const getListOrdersQueryKey = () => ["orders"] as const;

export function useGetCart() {
  return useQuery({
    queryKey: getGetCartQueryKey(),
    queryFn: () => apiFetch<Cart>("/cart"),
  });
}

export function useAddToCart() {
  return useMutation({
    mutationFn: ({ data }: { data: { productId: number; quantity: number } }) =>
      apiFetch<Cart>("/cart/items", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: { quantity: number } }) =>
      apiFetch<Cart>(`/cart/items/${productId}`, { method: "PATCH", body: JSON.stringify(data) }),
  });
}

export function useRemoveFromCart() {
  return useMutation({
    mutationFn: ({ productId }: { productId: number }) =>
      apiFetch<Cart>(`/cart/items/${productId}`, { method: "DELETE" }),
  });
}

export function useClearCart() {
  return useMutation({
    mutationFn: () => apiFetch<Cart>("/cart/clear", { method: "DELETE" }),
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: () => apiFetch<User>("/auth/me"),
    retry: false,
    throwOnError: false,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({ data }: { data: { email: string; password: string } }) =>
      apiFetch<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ data }: { data: { email: string; password: string; name: string } }) =>
      apiFetch<{ user: User }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useGetFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: () => apiFetch<Product[]>("/catalog/featured"),
  });
}

export function useListCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch<Category[]>("/categories"),
  });
}

export function useGetCatalogStats() {
  return useQuery({
    queryKey: ["catalog-stats"],
    queryFn: () => apiFetch<CatalogStats>("/catalog/stats"),
  });
}

export function useGetProduct(id: number, options?: { query?: Partial<UseQueryOptions<Product>> }) {
  return useQuery({
    queryKey: options?.query?.queryKey ?? ["products", id],
    queryFn: () => apiFetch<Product>(`/products/${id}`),
    enabled: options?.query?.enabled !== undefined ? options.query.enabled : !!id && !isNaN(id),
    ...options?.query,
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: ({ data }: { data: Partial<Product> & { name: string; price: number; category: string } }) =>
      apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiFetch<void>(`/products/${id}`, { method: "DELETE" }),
  });
}

export function useListOrders() {
  return useQuery({
    queryKey: getListOrdersQueryKey(),
    queryFn: () => apiFetch<Order[]>("/orders"),
  });
}

export function useGetOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => apiFetch<Order>(`/orders/${id}`),
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateOrder(_options?: unknown) {
  return useMutation({
    mutationFn: ({ data }: { data: { shippingAddress: string; paymentMethod: string } }) =>
      apiFetch<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useGetProductReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => apiFetch<Review[]>(`/products/${productId}/reviews`),
    enabled: !!productId,
  });
}

export function useCreateProductReview() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: { authorName: string; rating: number; body: string; title?: string } }) =>
      apiFetch<Review>(`/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(data) }),
  });
}
