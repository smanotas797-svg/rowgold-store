import { createContext, useContext, useCallback } from "react";
import {
  useGetMe,
  useLogin,
  useLogout,
  useRegister,
  getGetMeQueryKey,
  type User,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  const login = useCallback(async (email: string, password: string) => {
    await loginMutation.mutateAsync({ data: { email, password } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  }, [loginMutation, queryClient]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ data: { email, password, name } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  }, [registerMutation, queryClient]);

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }),
    });
  }, [logoutMutation, queryClient]);

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
