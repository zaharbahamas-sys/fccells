import { z } from 'zod';
import { insertProjectSchema, insertFuelCellSchema, fuelCells, projects } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  fuelCells: {
    list: {
      method: 'GET' as const,
      path: '/api/fuel-cells',
      responses: {
        200: z.array(z.custom<typeof fuelCells.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/fuel-cells/:id',
      responses: {
        200: z.custom<typeof fuelCells.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/fuel-cells',
      input: insertFuelCellSchema,
      responses: {
        201: z.custom<typeof fuelCells.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/projects/:id',
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  calculations: {
    calculate: {
      method: 'POST' as const,
      path: '/api/calculate',
      input: z.object({
        // Site Constraints
        loadKw: z.number().min(0),
        maxTemperature: z.number().optional().default(35),
        altitude: z.number().optional().default(0),
        
        // Equipment
        fuelCellId: z.number(),
        autonomyHours: z.number().min(0),
        hoursPerYear: z.number().optional().default(2000),
        
        // Diesel Generator
        dgCapacityKva: z.number().optional().default(20),
        dieselPrice: z.number().optional().default(1.0),
        pilferageFactor: z.number().optional().default(10),
        dgCapex: z.number().optional().default(5000),
        
        // Fuel Cell
        h2Price: z.number().optional().default(15),
        logisticsCostPct: z.number().optional().default(10),
        
        // Battery
        batteryBufferHours: z.number().optional().default(4),
        batteryDod: z.number().optional().default(0.8),
        systemVoltage: z.number().optional().default(48),
        
        // Logistics
        refuelingCycleDays: z.number().optional().default(7),
      }),
      responses: {
        200: z.object({
          deratingFactor: z.number(),
          grossPowerRequired: z.number(),
          parasiticLossKw: z.number(),
          netOutputKw: z.number(),
          fuelConsumptionHourly: z.number(),
          fuelConsumptionDaily: z.number(),
          batteryCapacityKwh: z.number(),
          batteryCapacityAh: z.number(),
          batteryStrings: z.number(),
          cableSizeMm2: z.number(),
          dgLoadFactor: z.number(),
          dgFuelConsumptionHourly: z.number(),
          dgFuelWithTheft: z.number(),
          dgDailyCost: z.number(),
          dgAnnualCost: z.number(),
          fcDailyCost: z.number(),
          fcAnnualCost: z.number(),
          dailySavings: z.number(),
          annualSavings: z.number(),
          paybackYears: z.number(),
          co2Savings: z.number(),
          totalH2Required: z.number(),
          cylindersRequired: z.number(),
          bundlesRequired: z.number(),
        }),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
