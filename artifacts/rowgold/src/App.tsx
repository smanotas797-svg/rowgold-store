import { useState, useCallback } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const PAGES_WITHOUT_FOOTER = ["/login", "/register"];
const PAGES_WITHOUT_NAVBAR = ["/login", "/register"];

function PageWrapper({ children }: { children: React.ReactNode }) {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const showNavbar = !PAGES_WITHOUT_NAVBAR.some((p) => path.endsWith(p));
  const showFooter = !PAGES_WITHOUT_FOOTER.some((p) => path.endsWith(p));

  return (
    <div style={{ minHeight: "100vh", background: "#080808" }}>
      {showNavbar && <Navbar />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PageWrapper><Home /></PageWrapper>} />
      <Route path="/catalog" component={() => <PageWrapper><Catalog /></PageWrapper>} />
      <Route path="/product/:id" component={({ params }) => <PageWrapper><ProductDetail id={params.id} /></PageWrapper>} />
      <Route path="/cart" component={() => <PageWrapper><Cart /></PageWrapper>} />
      <Route path="/checkout" component={() => <PageWrapper><Checkout /></PageWrapper>} />
      <Route path="/orders" component={() => <PageWrapper><Orders /></PageWrapper>} />
      <Route path="/login" component={() => <Login />} />
      <Route path="/register" component={() => <Register />} />
      <Route path="/admin" component={() => <PageWrapper><Admin /></PageWrapper>} />
      <Route component={() => <PageWrapper><NotFound /></PageWrapper>} />
    </Switch>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
          <CartProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </CartProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
