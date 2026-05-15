import { createContext, useContext, useCallback } from "react";
import { useGetMe, useLogin, useLogout, useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { sessionId } from "./CartContext";

const requestOptions = { headers: { "x-session-id": sessionId } };

interface AuthContextValue {
  user: ReturnType<typeof useGetMe>["data"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      throwOnError: false,
    },
    request: requestOptions,
  } as Parameters<typeof useGetMe>[0]);

  const loginMutation = useLogin({ request: requestOptions } as Parameters<typeof useLogin>[0]);
  const logoutMutation = useLogout({ request: requestOptions } as Parameters<typeof useLogout>[0]);
  const registerMutation = useRegister({ request: requestOptions } as Parameters<typeof useRegister>[0]);

  const login = useCallback(async (email: string, password: string) => {
    await loginMutation.mutateAsync({ data: { email, password } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  }, [loginMutation, queryClient]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ data: { email, password, name } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  }, [registerMutation, queryClient]);

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined as never, {
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
