import type { Express, Request, Response } from "express";
import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openai;
}

function sanitizeInput(value: unknown, defaultValue: string = "N/A"): string {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }
  return String(value).replace(/[<>]/g, "");
}

function buildContextData(data: Record<string, unknown>): string {
  const fields = [
    "Site Parameters:",
    `- Load: ${sanitizeInput(data.load)} kW`,
    `- Autonomy Required: ${sanitizeInput(data.autonomy)} hours`,
    `- System Voltage: ${sanitizeInput(data.voltage)} VDC`,
    `- Temperature: ${sanitizeInput(data.temperature)}C`,
    `- Altitude: ${sanitizeInput(data.altitude)} meters`,
    "",
    "Current Generator (if applicable):",
    `- Rated Power: ${sanitizeInput(data.dgRated)} kVA`,
    `- Load Factor: ${sanitizeInput(data.loadFactor)}%`,
    `- Age: ${sanitizeInput(data.dgAge)} years`,
    `- Diesel Cost (Daily): $${sanitizeInput(data.dgDailyCost)}`,
    "",
    `Proposed Fuel Cell: ${sanitizeInput(data.fuelCellModel, "Not selected")}`,
    `Fuel Cell Daily Cost: $${sanitizeInput(data.fcDailyCost)}`,
    `Daily Savings: $${sanitizeInput(data.dailySavings)}`,
    `Annual Savings: $${sanitizeInput(data.annualSavings)}`,
    `CO2 Savings: ${sanitizeInput(data.co2Savings)} kg/year`,
  ];
  return fields.join("\n");
}

function buildPrompt(template: string, contextData: string, langInstruction: string): string {
  return [template, contextData, "", langInstruction].join("\n");
}

export function registerAIConsultantRoutes(app: Express): void {
  app.post("/api/ai/analyze", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const taskType = sanitizeInput(data.taskType, "analysis");
      const language = sanitizeInput(data.language, "english");

      const contextData = buildContextData(data);

      const langInstruction = language === "arabic" ? "Write your response in Arabic." : "Write your response in English.";

      let systemPrompt = "";
      let userPrompt = "";

      if (taskType === "email") {
        systemPrompt = "You are a Project Manager writing a persuasive email to the CTO proposing infrastructure changes.";
        userPrompt = buildPrompt(
          "Write a persuasive email to the CTO proposing to replace the diesel generator at this site with a fuel cell system based on this data:\n\nFocus on:\n1. Financial savings and ROI\n2. Theft/fuel loss prevention\n3. Environmental benefits\n4. Reliability improvements",
          contextData,
          langInstruction
        );
      } else if (taskType === "action-plan") {
        systemPrompt = "You are a Senior Operations Manager creating implementation plans.";
        userPrompt = buildPrompt(
          "Create a detailed action plan for implementing a fuel cell system at this site:\n\nInclude:\n1. Phase 1: Planning and procurement (weeks 1-4)\n2. Phase 2: Site preparation (weeks 5-8)\n3. Phase 3: Installation and commissioning (weeks 9-12)\n4. Phase 4: Training and handover (weeks 13-14)\n5. Key risks and mitigation strategies",
          contextData,
          langInstruction
        );
      } else {
        systemPrompt = "You are a Senior Power Systems Engineer providing technical recommendations.";
        userPrompt = buildPrompt(
          "Analyze this fuel cell power system configuration and provide engineering recommendations:\n\nInclude:\n1. System sizing assessment\n2. Battery bank recommendations\n3. Hydrogen storage and logistics considerations\n4. Potential challenges and solutions\n5. Overall recommendation (proceed, modify, or reconsider)",
          contextData,
          langInstruction
        );
      }

      const client = getOpenAIClient();
      if (!client) {
        return res.json({
          success: false,
          error: "OpenAI API key not configured",
          recommendation: getFallbackRecommendation(req.body),
        });
      }

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const content = response.choices[0]?.message?.content || "";

      res.json({
        success: true,
        content,
        taskType,
        language,
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      res.status(500).json({
        success: false,
        error: errorMessage,
        recommendation: getFallbackRecommendation(req.body),
      });
    }
  });
}

function getFallbackRecommendation(data: Record<string, unknown>): string {
  const load = Number(data.load) || 0;
  const dailySavings = Number(data.dailySavings) || 0;

  if (load < 2) {
    return "For small loads under 2kW, consider portable DMFC fuel cells like SFC EFOY series for their low maintenance and easy fuel handling.";
  } else if (load < 5) {
    return "For loads between 2-5kW, consider hydrogen PEM fuel cells like Ballard FCgen series. Ensure reliable hydrogen supply chain.";
  } else if (dailySavings > 0) {
    return "The analysis shows positive daily savings. Consider proceeding with fuel cell deployment after validating hydrogen logistics.";
  } else {
    return "Current diesel costs may not justify fuel cell investment. Consider sites with higher diesel prices or fuel theft issues.";
  }
}
