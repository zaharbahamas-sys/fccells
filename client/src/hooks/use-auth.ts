import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
  const storedUser = localStorage.getItem("fcpms_user");
  const isAuthenticated = localStorage.getItem("fcpms_authenticated") === "true";
  
  if (isAuthenticated && storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("fcpms_user");
      localStorage.removeItem("fcpms_authenticated");
    }
  }

  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const user = await response.json();
  if (user) {
    localStorage.setItem("fcpms_user", JSON.stringify(user));
    localStorage.setItem("fcpms_authenticated", "true");
  }
  return user;
}

async function logout(): Promise<void> {
  localStorage.removeItem("fcpms_user");
  localStorage.removeItem("fcpms_authenticated");
  window.location.href = "/api/logout";
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
