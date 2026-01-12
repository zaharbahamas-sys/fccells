import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type CalculationInput = z.infer<typeof api.calculations.calculate.input>;
type CalculationResult = z.infer<typeof api.calculations.calculate.responses[200]>;

export function useCalculate() {
  return useMutation<CalculationResult, Error, CalculationInput>({
    mutationFn: async (data) => {
      const validated = api.calculations.calculate.input.parse(data);
      const res = await fetch(api.calculations.calculate.path, {
        method: api.calculations.calculate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Fuel Cell model not found for calculation");
        throw new Error("Calculation failed");
      }
      
      return api.calculations.calculate.responses[200].parse(await res.json());
    },
  });
}
