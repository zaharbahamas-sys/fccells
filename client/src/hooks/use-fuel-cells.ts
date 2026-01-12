import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertFuelCell } from "@shared/schema";

export function useFuelCells() {
  return useQuery({
    queryKey: [api.fuelCells.list.path],
    queryFn: async () => {
      const res = await fetch(api.fuelCells.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch fuel cells");
      return api.fuelCells.list.responses[200].parse(await res.json());
    },
  });
}

export function useFuelCell(id: number) {
  return useQuery({
    queryKey: [api.fuelCells.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.fuelCells.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch fuel cell");
      return api.fuelCells.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateFuelCell() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFuelCell) => {
      const res = await fetch(api.fuelCells.create.path, {
        method: api.fuelCells.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.fuelCells.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create fuel cell");
      }
      return api.fuelCells.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.fuelCells.list.path] });
    },
  });
}
