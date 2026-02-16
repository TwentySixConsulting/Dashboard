import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/lib/auth";

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch,
  };
}
