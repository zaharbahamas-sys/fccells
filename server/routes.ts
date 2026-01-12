import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertBlogPostSchema } from "@shared/schema";
import { registerAIConsultantRoutes } from "./replit_integrations/ai-consultant/index";
import { registerChatRoutes } from "./replit_integrations/chat/index";
import { registerImageRoutes } from "./replit_integrations/image/index";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerGoogleAuthRoutes } from "./google-auth";
import {
  createSuperAdmin,
  authenticateUser,
  sendOtp,
  verifyOtp,
  submitRegistration,
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
} from "./auth";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

const researchDataCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCachedData(key: string): any | null {
  const cached = researchDataCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  researchDataCache.set(key, { data, timestamp: Date.now() });
}

const researchDatabaseSources = {
  doeHydrogen: {
    name: "DOE Hydrogen and Fuel Cell Technologies Office",
    nameAr: "مكتب تقنيات الهيدروجين وخلايا الوقود - وزارة الطاقة الأمريكية",
    baseUrl: "https://www.energy.gov/eere/fuelcells",
    type: "government",
    description: "Official US Department of Energy research on hydrogen and fuel cells"
  },
  nrel: {
    name: "National Renewable Energy Laboratory (NREL)",
    nameAr: "المختبر الوطني للطاقة المتجددة",
    baseUrl: "https://www.nrel.gov/hydrogen/",
    type: "government",
    description: "Leading US laboratory for renewable energy and hydrogen research"
  },
  fchea: {
    name: "Fuel Cell & Hydrogen Energy Association",
    nameAr: "جمعية خلايا الوقود والهيدروجين",
    baseUrl: "https://www.fchea.org/",
    type: "industry",
    description: "Industry association for fuel cell and hydrogen technologies"
  },
  hydrogenEurope: {
    name: "Hydrogen Europe",
    nameAr: "الهيدروجين أوروبا",
    baseUrl: "https://hydrogeneurope.eu/",
    type: "industry",
    description: "European hydrogen and fuel cell industry association"
  },
  iea: {
    name: "International Energy Agency - Hydrogen",
    nameAr: "وكالة الطاقة الدولية - الهيدروجين",
    baseUrl: "https://www.iea.org/energy-system/low-emission-fuels/hydrogen",
    type: "international",
    description: "Global energy statistics and hydrogen pathway analysis"
  }
};

const researchPublications = [
  {
    id: "doe-2024-telecom",
    title: "Hydrogen Fuel Cells for Telecommunications Backup Power",
    titleAr: "خلايا الوقود الهيدروجينية للطاقة الاحتياطية للاتصالات",
    authors: ["DOE EERE", "Sandia National Laboratories"],
    year: 2024,
    source: "doeHydrogen",
    abstract: "Comprehensive analysis of hydrogen fuel cell systems for telecom tower backup power, including cost analysis, reliability metrics, and deployment considerations.",
    url: "https://www.energy.gov/eere/fuelcells/articles/hydrogen-fuel-cells-backup-power-systems",
    tags: ["telecom", "backup power", "hydrogen", "cost analysis"],
    category: "Technical Report"
  },
  {
    id: "nrel-2024-green-h2",
    title: "Green Hydrogen Production Pathways and Costs",
    titleAr: "مسارات وتكاليف إنتاج الهيدروجين الأخضر",
    authors: ["NREL Hydrogen Team"],
    year: 2024,
    source: "nrel",
    abstract: "Analysis of electrolysis technologies, renewable integration, and levelized cost of hydrogen (LCOH) for various production scales.",
    url: "https://www.nrel.gov/hydrogen/production.html",
    tags: ["green hydrogen", "electrolysis", "cost", "renewable"],
    category: "Research Paper"
  },
  {
    id: "iea-2023-h2-review",
    title: "Global Hydrogen Review 2023",
    titleAr: "مراجعة الهيدروجين العالمية 2023",
    authors: ["International Energy Agency"],
    year: 2023,
    source: "iea",
    abstract: "Annual review of global hydrogen demand, production, infrastructure development, and policy developments across all sectors.",
    url: "https://www.iea.org/reports/global-hydrogen-review-2023",
    tags: ["global", "policy", "infrastructure", "demand"],
    category: "Annual Report"
  },
  {
    id: "fchea-2024-stationary",
    title: "State of the Stationary Fuel Cell Industry Report",
    titleAr: "تقرير حالة صناعة خلايا الوقود الثابتة",
    authors: ["FCHEA Research Team"],
    year: 2024,
    source: "fchea",
    abstract: "Industry analysis of stationary fuel cell deployments including backup power, combined heat and power, and prime power applications.",
    url: "https://www.fchea.org/in-transition",
    tags: ["industry", "stationary", "deployments", "market"],
    category: "Industry Report"
  },
  {
    id: "heurope-2024-telecom",
    title: "Fuel Cells for European Telecom Infrastructure",
    titleAr: "خلايا الوقود للبنية التحتية للاتصالات الأوروبية",
    authors: ["Hydrogen Europe"],
    year: 2024,
    source: "hydrogenEurope",
    abstract: "Assessment of fuel cell adoption in European telecom networks, regulatory frameworks, and carbon reduction strategies.",
    url: "https://hydrogeneurope.eu/applications/",
    tags: ["europe", "telecom", "regulation", "carbon"],
    category: "Policy Brief"
  },
  {
    id: "doe-2023-cost",
    title: "Fuel Cell System Cost Analysis",
    titleAr: "تحليل تكلفة نظام خلايا الوقود",
    authors: ["DOE EERE", "Strategic Analysis Inc."],
    year: 2023,
    source: "doeHydrogen",
    abstract: "Detailed cost breakdown of PEM fuel cell systems for various applications, including manufacturing cost projections to 2030.",
    url: "https://www.energy.gov/eere/fuelcells/fuel-cell-technologies-office-accomplishments",
    tags: ["cost", "PEM", "manufacturing", "projections"],
    category: "Cost Analysis"
  },
  {
    id: "nrel-2024-durability",
    title: "Fuel Cell Durability and Lifetime Analysis",
    titleAr: "تحليل متانة وعمر خلايا الوقود",
    authors: ["NREL Fuel Cell Team"],
    year: 2024,
    source: "nrel",
    abstract: "Research on fuel cell degradation mechanisms, lifetime prediction models, and strategies to extend operational life beyond 80,000 hours.",
    url: "https://www.nrel.gov/hydrogen/fuel-cell-durability.html",
    tags: ["durability", "lifetime", "degradation", "reliability"],
    category: "Research Paper"
  },
  {
    id: "iea-2024-h2-africa",
    title: "Hydrogen in Africa: Opportunities and Challenges",
    titleAr: "الهيدروجين في أفريقيا: الفرص والتحديات",
    authors: ["IEA Africa Energy Outlook"],
    year: 2024,
    source: "iea",
    abstract: "Analysis of hydrogen production potential, infrastructure needs, and telecom applications in African markets.",
    url: "https://www.iea.org/regions/africa",
    tags: ["africa", "infrastructure", "potential", "telecom"],
    category: "Regional Analysis"
  }
];

const hydrogenMarketData = {
  currentPrices: {
    grayH2: { value: 1.5, unit: "$/kg", source: "IEA 2024", trend: "stable" },
    blueH2: { value: 2.5, unit: "$/kg", source: "IEA 2024", trend: "declining" },
    greenH2: { value: 5.0, unit: "$/kg", source: "IEA 2024", trend: "declining" },
    projected2030: { value: 2.0, unit: "$/kg", source: "BloombergNEF", trend: "target" }
  },
  globalCapacity: {
    electrolysis2023: { value: 1.4, unit: "GW", source: "IEA" },
    electrolysis2030Target: { value: 134, unit: "GW", source: "IEA Net Zero" },
    fuelCellShipments2023: { value: 1.2, unit: "GW", source: "E4tech" },
    telecomInstallations: { value: 45000, unit: "units", source: "FCHEA" }
  },
  costTrends: [
    { year: 2020, pemCost: 1500, sofcCost: 2500, electrolyzerCost: 1200 },
    { year: 2022, pemCost: 1200, sofcCost: 2000, electrolyzerCost: 900 },
    { year: 2024, pemCost: 900, sofcCost: 1500, electrolyzerCost: 650 },
    { year: 2026, pemCost: 700, sofcCost: 1200, electrolyzerCost: 450 },
    { year: 2030, pemCost: 400, sofcCost: 800, electrolyzerCost: 250 }
  ]
};

async function proxyToPython(path: string, method: string, body?: any) {
  const url = `${PYTHON_SERVICE_URL}${path}`;
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(url, options);
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {
  // Setup Replit Auth (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Setup Google OAuth (direct login without Replit)
  registerGoogleAuthRoutes(app);

  // Initialize Super Admin on startup
  await createSuperAdmin();

  // Register AI and Chat routes
  registerAIConsultantRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // === Authentication Routes ===
  app.post("/api/auth/login", async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password required" });
    }
    const result = await authenticateUser(identifier, password);
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }
    res.json({ success: true, user: result.user });
  });

  app.post("/api/auth/send-otp", async (req, res) => {
    const { identifier, type } = req.body;
    if (!identifier || !type) {
      return res.status(400).json({ error: "Identifier and type required" });
    }
    const result = await sendOtp(identifier, type);
    res.json(result);
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    const { identifier, code } = req.body;
    if (!identifier || !code) {
      return res.status(400).json({ error: "Identifier and code required" });
    }
    const result = await verifyOtp(identifier, code);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true });
  });

  app.post("/api/auth/register", async (req, res) => {
    const { email, phone, firstName, lastName, organization, reason, password } = req.body;
    if (!firstName || !lastName || !password) {
      return res.status(400).json({ error: "First name, last name, and password required" });
    }
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone required" });
    }
    const result = await submitRegistration({
      email,
      phone,
      firstName,
      lastName,
      organization,
      reason,
      password,
    });
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Admin routes for registration approval
  app.get("/api/admin/registrations", async (_req, res) => {
    const registrations = await getPendingRegistrations();
    res.json(registrations);
  });

  app.post("/api/admin/registrations/:id/approve", async (req, res) => {
    const id = Number(req.params.id);
    const { adminId, notes } = req.body;
    const result = await approveRegistration(id, adminId, notes);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  app.post("/api/admin/registrations/:id/reject", async (req, res) => {
    const id = Number(req.params.id);
    const { adminId, notes } = req.body;
    const result = await rejectRegistration(id, adminId, notes);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  app.get("/api/admin/users", async (_req, res) => {
    const users = await getAllUsers();
    res.json(users);
  });

  // User profile routes
  app.get("/api/user/:id", async (req, res) => {
    const id = Number(req.params.id);
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  app.patch("/api/user/:id/profile", async (req, res) => {
    const id = Number(req.params.id);
    const { firstName, lastName, jobTitle, profilePhoto } = req.body;
    const result = await updateUserProfile(id, { firstName, lastName, jobTitle, profilePhoto });
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }
    const updatedUser = await getUserById(id);
    res.json({ success: true, user: updatedUser });
  });

  app.post("/api/user/:id/change-password", async (req, res) => {
    const id = Number(req.params.id);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password required" });
    }
    const result = await changePassword(id, currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // === Python Service Proxy ===
  app.all("/api/python/*", async (req, res) => {
    try {
      const pythonPath = req.path;
      const pythonResponse = await proxyToPython(pythonPath, req.method, req.body);
      
      const contentType = pythonResponse.headers.get("content-type") || "";
      
      if (contentType.includes("application/pdf") || contentType.includes("image/") || contentType.includes("text/csv")) {
        const buffer = Buffer.from(await pythonResponse.arrayBuffer());
        res.set("Content-Type", contentType);
        const disposition = pythonResponse.headers.get("content-disposition");
        if (disposition) {
          res.set("Content-Disposition", disposition);
        }
        return res.send(buffer);
      }
      
      const text = await pythonResponse.text();
      try {
        const data = JSON.parse(text);
        res.status(pythonResponse.status).json(data);
      } catch {
        res.status(pythonResponse.status).send(text);
      }
    } catch (error) {
      console.error("Python proxy error:", error);
      res.status(503).json({ 
        error: "Python service unavailable",
        message: "Start the Python service with: python python_services/app.py"
      });
    }
  });
  // === Research Database API ===
  app.get("/api/research/sources", (_req, res) => {
    const cacheKey = "research-sources";
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    const result = Object.entries(researchDatabaseSources).map(([key, source]) => ({
      id: key,
      ...source
    }));
    setCachedData(cacheKey, result);
    res.json(result);
  });

  app.get("/api/research/publications", (req, res) => {
    const { source, category, tag, search } = req.query;
    let results = [...researchPublications];
    
    if (source && typeof source === "string") {
      results = results.filter(p => p.source === source);
    }
    if (category && typeof category === "string") {
      results = results.filter(p => p.category === category);
    }
    if (tag && typeof tag === "string") {
      results = results.filter(p => p.tags.includes(tag.toLowerCase()));
    }
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.abstract.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.includes(searchLower))
      );
    }
    
    res.json({
      count: results.length,
      publications: results.map(p => ({
        ...p,
        sourceName: researchDatabaseSources[p.source as keyof typeof researchDatabaseSources]?.name || p.source
      }))
    });
  });

  app.get("/api/research/publication/:id", (req, res) => {
    const publication = researchPublications.find(p => p.id === req.params.id);
    if (!publication) {
      return res.status(404).json({ error: "Publication not found" });
    }
    res.json({
      ...publication,
      sourceName: researchDatabaseSources[publication.source as keyof typeof researchDatabaseSources]?.name || publication.source,
      sourceUrl: researchDatabaseSources[publication.source as keyof typeof researchDatabaseSources]?.baseUrl
    });
  });

  app.get("/api/research/market-data", (_req, res) => {
    const cacheKey = "market-data";
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    setCachedData(cacheKey, hydrogenMarketData);
    res.json(hydrogenMarketData);
  });

  app.get("/api/research/categories", (_req, res) => {
    const categories = Array.from(new Set(researchPublications.map(p => p.category)));
    const tags = Array.from(new Set(researchPublications.flatMap(p => p.tags)));
    res.json({ categories, tags });
  });

  // === Fuel Cells CRUD ===
  app.get(api.fuelCells.list.path, async (_req, res) => {
    const items = await storage.getFuelCells();
    res.json(items);
  });

  app.get(api.fuelCells.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const item = await storage.getFuelCell(id);
    if (!item) return res.status(404).json({ message: "Fuel Cell not found" });
    res.json(item);
  });

  app.post(api.fuelCells.create.path, async (req, res) => {
    try {
      const input = api.fuelCells.create.input.parse(req.body);
      const created = await storage.createFuelCell(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Projects CRUD ===
  app.get(api.projects.list.path, async (_req, res) => {
    const items = await storage.getProjects();
    res.json(items);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const item = await storage.getProject(id);
    if (!item) return res.status(404).json({ message: "Project not found" });
    res.json(item);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const created = await storage.createProject(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });
  
  app.delete(api.projects.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getProject(id);
    if (!existing) return res.status(404).json({ message: "Project not found" });
    await storage.deleteProject(id);
    res.status(204).send();
  });

  // === Blog Posts CRUD with Admin Approval Workflow ===
  app.get("/api/blog/posts", async (req, res) => {
    const { status } = req.query;
    const posts = await storage.getBlogPosts(status as string | undefined);
    res.json(posts);
  });

  app.get("/api/blog/posts/published", async (_req, res) => {
    const posts = await storage.getBlogPosts("approved");
    res.json(posts);
  });

  app.get("/api/blog/posts/pending", async (_req, res) => {
    const posts = await storage.getBlogPosts("pending");
    res.json(posts);
  });

  app.get("/api/blog/post/:id", async (req, res) => {
    const id = Number(req.params.id);
    const post = await storage.getBlogPost(id);
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.json(post);
  });

  app.get("/api/blog/post/slug/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    res.json(post);
  });

  app.post("/api/blog/posts", async (req, res) => {
    try {
      const input = insertBlogPostSchema.parse(req.body);
      const created = await storage.createBlogPost(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch("/api/blog/post/:id", async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getBlogPost(id);
    if (!existing) return res.status(404).json({ message: "Blog post not found" });
    const updated = await storage.updateBlogPost(id, req.body);
    res.json(updated);
  });

  app.post("/api/blog/post/:id/approve", async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getBlogPost(id);
    if (!existing) return res.status(404).json({ message: "Blog post not found" });
    const updated = await storage.updateBlogPost(id, { 
      status: "approved", 
      reviewedBy: req.body.reviewedBy || "Admin",
      publishedAt: new Date()
    });
    res.json(updated);
  });

  app.post("/api/blog/post/:id/reject", async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getBlogPost(id);
    if (!existing) return res.status(404).json({ message: "Blog post not found" });
    const updated = await storage.updateBlogPost(id, { 
      status: "rejected", 
      reviewedBy: req.body.reviewedBy || "Admin",
      adminNotes: req.body.notes
    });
    res.json(updated);
  });

  app.delete("/api/blog/post/:id", async (req, res) => {
    const id = Number(req.params.id);
    const existing = await storage.getBlogPost(id);
    if (!existing) return res.status(404).json({ message: "Blog post not found" });
    await storage.deleteBlogPost(id);
    res.status(204).send();
  });

  // Blog Comments
  app.get("/api/blog/post/:id/comments", async (req, res) => {
    const postId = Number(req.params.id);
    const comments = await storage.getCommentsByPostId(postId);
    res.json(comments);
  });

  app.post("/api/blog/post/:id/comments", async (req, res) => {
    const postId = Number(req.params.id);
    const { authorName, authorEmail, content } = req.body;
    if (!authorName || !content) {
      return res.status(400).json({ message: "Name and comment are required" });
    }
    const comment = await storage.createComment({ postId, authorName, authorEmail, content });
    res.status(201).json(comment);
  });

  // Contact Messages
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject and message are required" });
    }
    const contact = await storage.createContactMessage({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: "Message sent successfully" });
  });

  app.get("/api/contact/messages", async (_req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  });

  // === Advanced Calculation Engine (EcoPower Logic) ===
  app.post(api.calculations.calculate.path, async (req, res) => {
    try {
      const body = api.calculations.calculate.input.parse(req.body);
      const { 
        loadKw, 
        maxTemperature = 35,
        altitude = 0,
        fuelCellId,
        autonomyHours,
        hoursPerYear = 2000,
        dgCapacityKva = 20,
        dieselPrice = 1.0,
        pilferageFactor = 10,
        dgCapex = 5000,
        h2Price = 15.0,
        logisticsCostPct = 10,
        batteryBufferHours = 4,
        batteryDod = 0.8,
        systemVoltage = 48,
        refuelingCycleDays = 7,
      } = body;
      
      const fuelCell = await storage.getFuelCell(fuelCellId);
      if (!fuelCell) return res.status(404).json({ message: "Fuel Cell not found" });

      // === 1. Temperature & Altitude Derating ===
      let deratingFactor = 1.0;
      
      // Temperature derating: -1.5% per degree above 35°C
      if (maxTemperature > 35) {
        deratingFactor -= (maxTemperature - 35) * 0.015;
      }
      
      // Altitude derating: -1% per 100m above sea level (above 500m)
      if (altitude > 500) {
        deratingFactor -= ((altitude - 500) / 100) * 0.01;
      }
      
      deratingFactor = Math.max(deratingFactor, 0.5); // Min 50%
      
      // Gross power required (compensating for derating)
      const grossPowerRequired = loadKw / deratingFactor;
      
      // === 2. Parasitic Loss (Fans, Pumps) ===
      const parasiticLossRate = fuelCell.parasiticLoss || 0.08;
      const parasiticLossKw = grossPowerRequired * parasiticLossRate;
      const netOutputKw = grossPowerRequired - parasiticLossKw;
      
      // === 2a. Fuel Cell Capacity Validation ===
      const fcRatedPower = fuelCell.ratedPowerKw;
      const fcDeratedPowerSingle = fcRatedPower * deratingFactor * (1 - parasiticLossRate);
      
      // Calculate required stacks based on derated capacity to meet actual load
      const requiredStackCount = Math.max(1, Math.ceil(loadKw / fcDeratedPowerSingle));
      
      // Calculate totals based on required stack count
      const totalRatedPower = fcRatedPower * requiredStackCount;
      const totalDeratedPower = fcDeratedPowerSingle * requiredStackCount;
      
      // Check if we need more than one stack
      const needsMultipleStacks = requiredStackCount > 1;
      
      // Calculate capacity metrics based on total system capacity
      const capacityShortfall = Math.max(0, loadKw - totalDeratedPower);
      const capacityMargin = ((totalDeratedPower - loadKw) / loadKw) * 100;
      
      // System is undersized if the total derated capacity still can't meet the load
      const isUndersized = totalDeratedPower < loadKw;
      
      // === 3. Fuel Consumption (Fuel Cell) ===
      const fcEfficiency = fuelCell.efficiency / 100;
      const lhv = fuelCell.lhv || 33.3; // kWh/kg for H2
      const fuelConsumptionHourly = grossPowerRequired / fcEfficiency / lhv;
      const fuelConsumptionDaily = fuelConsumptionHourly * 24;
      
      // === 4. Battery Buffer Sizing ===
      const batteryCapacityKwh = (loadKw * batteryBufferHours) / batteryDod;
      const batteryCapacityAh = (loadKw * 1000 * batteryBufferHours) / (systemVoltage * batteryDod);
      const batteryStrings = Math.ceil(batteryCapacityAh / 150); // 150Ah blocks
      
      // === 5. Cable Sizing ===
      const currentAmps = (loadKw * 1000) / systemVoltage;
      const cableSizeMm2 = currentAmps / 4; // 4 A/mm² rule
      
      // === 6. Diesel Generator Analysis ===
      const dgCapacityKw = dgCapacityKva * 0.8;
      const dgLoadFactor = (loadKw / dgCapacityKw) * 100;
      
      // Non-linear fuel consumption: Fuel = 0.07*Rated + 0.24*Load
      const dgFuelConsumptionHourly = (0.07 * dgCapacityKw) + (0.24 * loadKw);
      const dgFuelWithTheft = dgFuelConsumptionHourly * (1 + pilferageFactor / 100);
      
      const dgDailyCost = dgFuelWithTheft * 24 * dieselPrice;
      const dgMaintenanceDaily = 0.5 * 24; // $0.50/hr
      const dgTotalDailyCost = dgDailyCost + dgMaintenanceDaily;
      const dgAnnualCost = dgTotalDailyCost * 365;
      
      // CO2 emissions from diesel (2.68 kg CO2 per liter)
      const co2Emissions = dgFuelWithTheft * 24 * 365 * 2.68;
      
      // === 7. Fuel Cell Cost Analysis ===
      const fcFuelCostBase = fuelConsumptionHourly * 24 * h2Price;
      const fcFuelCostWithLogistics = fcFuelCostBase * (1 + logisticsCostPct / 100);
      const fcMaintenanceDaily = 0.05 * 24; // $0.05/hr
      const fcTotalDailyCost = fcFuelCostWithLogistics + fcMaintenanceDaily;
      const fcAnnualCost = fcTotalDailyCost * 365;
      
      // === 8. Financial Comparison ===
      const dailySavings = dgTotalDailyCost - fcTotalDailyCost;
      const annualSavings = dailySavings * 365;
      
      // CAPEX difference and payback (always use required stack count)
      const fcCapex = (fuelCell.capexPerKw || 3000) * fcRatedPower * requiredStackCount;
      const capexDifference = fcCapex - dgCapex;
      
      // Payback calculation with proper handling of negative savings
      let paybackYears: number;
      let paybackStatus: string;
      if (annualSavings > 0) {
        paybackYears = capexDifference / annualSavings;
        paybackStatus = paybackYears <= 5 ? "excellent" : paybackYears <= 10 ? "good" : "marginal";
      } else if (annualSavings === 0) {
        paybackYears = Infinity;
        paybackStatus = "break-even";
      } else {
        paybackYears = Infinity;
        paybackStatus = "diesel-favorable";
      }
      
      // === 9. Logistics Planning (H2 Cylinders) ===
      const totalH2Required = fuelConsumptionHourly * 24 * refuelingCycleDays;
      const cylindersRequired = Math.ceil(totalH2Required / 0.89); // 50L @ 200bar = 0.89kg
      const bundlesRequired = Math.ceil(cylindersRequired / 12); // 12-pack bundles

      res.json({
        deratingFactor,
        grossPowerRequired: Math.round(grossPowerRequired * 100) / 100,
        parasiticLossKw: Math.round(parasiticLossKw * 100) / 100,
        netOutputKw: Math.round(netOutputKw * 100) / 100,
        fuelConsumptionHourly: Math.round(fuelConsumptionHourly * 1000) / 1000,
        fuelConsumptionDaily: Math.round(fuelConsumptionDaily * 100) / 100,
        batteryCapacityKwh: Math.round(batteryCapacityKwh * 10) / 10,
        batteryCapacityAh: Math.round(batteryCapacityAh),
        batteryStrings,
        cableSizeMm2: Math.round(cableSizeMm2 * 10) / 10,
        dgLoadFactor: Math.round(dgLoadFactor),
        dgFuelConsumptionHourly: Math.round(dgFuelConsumptionHourly * 100) / 100,
        dgFuelWithTheft: Math.round(dgFuelWithTheft * 100) / 100,
        dgDailyCost: Math.round(dgTotalDailyCost * 100) / 100,
        dgAnnualCost: Math.round(dgAnnualCost),
        fcDailyCost: Math.round(fcTotalDailyCost * 100) / 100,
        fcAnnualCost: Math.round(fcAnnualCost),
        dailySavings: Math.round(dailySavings * 100) / 100,
        annualSavings: Math.round(annualSavings),
        paybackYears: paybackYears === Infinity ? null : Math.round(paybackYears * 10) / 10,
        paybackStatus,
        co2Savings: Math.round(co2Emissions),
        totalH2Required: Math.round(totalH2Required * 10) / 10,
        cylindersRequired,
        bundlesRequired,
        fcRatedPower,
        fcDeratedPower: Math.round(fcDeratedPowerSingle * 100) / 100,
        totalRatedPower: Math.round(totalRatedPower * 100) / 100,
        totalDeratedPower: Math.round(totalDeratedPower * 100) / 100,
        requiredStackCount,
        needsMultipleStacks,
        isUndersized,
        capacityShortfall: Math.round(capacityShortfall * 100) / 100,
        capacityMargin: Math.round(capacityMargin),
        fcCapex: Math.round(fcCapex),
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();
}

async function seedDatabase() {
  const existingFC = await storage.getFuelCells();
  if (existingFC.length === 0) {
    // Seed with verified fuel cell data for telecom applications
    // Sources: Manufacturer websites, DOE Hydrogen Program, GSMA reports
    const fuelCellData = [
      // === BALLARD POWER SYSTEMS ===
      {
        manufacturer: "Ballard",
        model: "FCgen-H2PM",
        type: "PEMFC",
        ratedPowerKw: 5.0,
        minPowerKw: 1.0,
        maxPowerKw: 5.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.06,
        efficiency: 50,
        parasiticLoss: 0.08,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 3500,
        datasheetUrl: "https://www.ballard.com/fuel-cell-solutions/backup-power",
        source: "Ballard Power Systems",
        telecomApplication: "Primary backup power for small telecom towers, remote BTS sites. 48V DC direct integration with telecom rectifiers.",
        referenceUrl: "https://www.ballard.com/fuel-cell-solutions/fuel-cell-power-products/backup-power-systems"
      },
      {
        manufacturer: "Ballard",
        model: "FCgen-1020ACS",
        type: "PEMFC",
        ratedPowerKw: 1.2,
        minPowerKw: 0.2,
        maxPowerKw: 1.2,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.065,
        efficiency: 46,
        parasiticLoss: 0.06,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 4200,
        datasheetUrl: "https://www.ballard.com/fuel-cell-solutions/backup-power",
        source: "Ballard Power Systems",
        telecomApplication: "Micro BTS, small cell backup. Compact form factor for cabinet installation. Low hydrogen consumption ideal for remote sites.",
        referenceUrl: "https://www.ballard.com/fuel-cell-solutions/fuel-cell-power-products/backup-power-systems"
      },
      // === PLUG POWER ===
      {
        manufacturer: "Plug Power",
        model: "GenDrive 1000",
        type: "PEMFC",
        ratedPowerKw: 10.0,
        minPowerKw: 2.0,
        maxPowerKw: 10.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.055,
        efficiency: 55,
        parasiticLoss: 0.07,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 3200,
        datasheetUrl: "https://www.plugpower.com/fuel-cell-power/genkey/",
        source: "Plug Power Inc.",
        telecomApplication: "Medium telecom sites, multi-carrier towers. Proven reliability in material handling adapted for stationary backup.",
        referenceUrl: "https://www.plugpower.com/applications/stationary-power/telecom/"
      },
      {
        manufacturer: "Plug Power",
        model: "GenSure HP",
        type: "PEMFC",
        ratedPowerKw: 5.0,
        minPowerKw: 1.0,
        maxPowerKw: 5.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.058,
        efficiency: 52,
        parasiticLoss: 0.08,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 3400,
        datasheetUrl: "https://www.plugpower.com/fuel-cell-power/gensure/",
        source: "Plug Power Inc.",
        telecomApplication: "Telecom backup power specifically designed for cell towers. Extended runtime capability with outdoor-rated enclosure.",
        referenceUrl: "https://www.plugpower.com/applications/stationary-power/telecom/"
      },
      // === CUMMINS (HYDROGENICS) ===
      {
        manufacturer: "Cummins",
        model: "HyPM HD 30",
        type: "PEMFC",
        ratedPowerKw: 30.0,
        minPowerKw: 5.0,
        maxPowerKw: 30.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.052,
        efficiency: 58,
        parasiticLoss: 0.09,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 2800,
        datasheetUrl: "https://www.cummins.com/new-power/applications/backup-power",
        source: "Cummins Inc. (Hydrogenics)",
        telecomApplication: "Large telecom hubs, data centers, MSC facilities. High power density for mission-critical infrastructure.",
        referenceUrl: "https://www.accelerazero.com/fuel-cells/hypm-hd45"
      },
      {
        manufacturer: "Cummins",
        model: "HyPM HD 12",
        type: "PEMFC",
        ratedPowerKw: 12.0,
        minPowerKw: 2.0,
        maxPowerKw: 12.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.054,
        efficiency: 56,
        parasiticLoss: 0.08,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 3000,
        datasheetUrl: "https://www.cummins.com/new-power/applications/backup-power",
        source: "Cummins Inc. (Hydrogenics)",
        telecomApplication: "Medium telecom sites, regional switching centers. Modular design allows scaling.",
        referenceUrl: "https://pdf.directindustry.com/pdf/hydrogen-systems/hypm-hd-power-modules/14703-775999.html"
      },
      // === SFC ENERGY ===
      {
        manufacturer: "SFC Energy",
        model: "EFOY Pro 2800",
        type: "DMFC",
        ratedPowerKw: 0.5,
        minPowerKw: 0.05,
        maxPowerKw: 0.5,
        outputVoltageV: 24,
        fuelConsumptionPerKwh: 0.9,
        efficiency: 35,
        parasiticLoss: 0.05,
        fuelType: "Methanol",
        lhv: 5.5,
        capexPerKw: 5000,
        datasheetUrl: "https://www.sfc.com/en/products/efoy-pro/",
        source: "SFC Energy AG",
        telecomApplication: "Remote sensors, small IoT gateways, low-power repeaters. No hydrogen infrastructure needed - uses methanol cartridges.",
        referenceUrl: "https://www.efoy-pro.com/en/"
      },
      {
        manufacturer: "SFC Energy",
        model: "EFOY Pro 12000 Duo",
        type: "DMFC",
        ratedPowerKw: 1.0,
        minPowerKw: 0.1,
        maxPowerKw: 1.0,
        outputVoltageV: 24,
        fuelConsumptionPerKwh: 0.85,
        efficiency: 38,
        parasiticLoss: 0.06,
        fuelType: "Methanol",
        lhv: 5.5,
        capexPerKw: 4500,
        datasheetUrl: "https://www.sfc.com/en/products/efoy-pro/",
        source: "SFC Energy AG",
        telecomApplication: "Off-grid telecom sites, surveillance systems. Dual unit redundancy for critical applications. Easy fuel logistics.",
        referenceUrl: "https://www.efoy-pro.com/en/"
      },
      // === BLOOM ENERGY ===
      {
        manufacturer: "Bloom Energy",
        model: "Energy Server ES5",
        type: "SOFC",
        ratedPowerKw: 200.0,
        minPowerKw: 50.0,
        maxPowerKw: 200.0,
        outputVoltageV: 480,
        fuelConsumptionPerKwh: 0.12,
        efficiency: 60,
        parasiticLoss: 0.12,
        fuelType: "Natural Gas",
        lhv: 13.9,
        capexPerKw: 4000,
        datasheetUrl: "https://www.bloomenergy.com/bloomenergyserver/",
        source: "Bloom Energy Corporation",
        telecomApplication: "Large data centers, central offices, network operations centers. Primary power or microgrid integration.",
        referenceUrl: "https://www.bloomenergy.com/industries/data-center-power/"
      },
      // === INTELLIGENT ENERGY ===
      {
        manufacturer: "Intelligent Energy",
        model: "IE-POWER 800W",
        type: "PEMFC",
        ratedPowerKw: 0.8,
        minPowerKw: 0.1,
        maxPowerKw: 0.8,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.065,
        efficiency: 46,
        parasiticLoss: 0.05,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 4800,
        datasheetUrl: "https://www.intelligent-energy.com/our-products/stationary-power/",
        source: "Intelligent Energy Ltd",
        telecomApplication: "Femtocells, small cells, DAS nodes. Ultra-compact design for urban deployments. Indoor-safe operation.",
        referenceUrl: "https://www.intelligent-energy.com/our-products/ie-power-hydrogen-fuel-cell-module/"
      },
      {
        manufacturer: "Intelligent Energy",
        model: "IE-POWER 2.5kW",
        type: "PEMFC",
        ratedPowerKw: 2.5,
        minPowerKw: 0.5,
        maxPowerKw: 2.5,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.058,
        efficiency: 52,
        parasiticLoss: 0.07,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 4000,
        datasheetUrl: "https://www.intelligent-energy.com/our-products/stationary-power/",
        source: "Intelligent Energy Ltd",
        telecomApplication: "Rooftop BTS, rural towers. Lightweight design for structural constraints. Proven in African telecom deployments.",
        referenceUrl: "https://www.intelligent-energy.com/our-industries/telecoms/"
      },
      // === POWERCELL SWEDEN ===
      {
        manufacturer: "PowerCell Sweden",
        model: "PS-5",
        type: "PEMFC",
        ratedPowerKw: 5.0,
        minPowerKw: 1.0,
        maxPowerKw: 5.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.057,
        efficiency: 53,
        parasiticLoss: 0.08,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 3600,
        datasheetUrl: "https://www.powercellgroup.com/products/",
        source: "PowerCell Sweden AB",
        telecomApplication: "Nordic telecom sites, cold climate operation. Wide temperature range -40C to +55C. Grid-tied or off-grid.",
        referenceUrl: "https://cdn.komachine.com/media/product-catalog/Catalog-Bumha-PowerCell-S3.pdf"
      },
      // === HORIZON FUEL CELL ===
      {
        manufacturer: "Horizon",
        model: "H-3000",
        type: "PEMFC",
        ratedPowerKw: 3.0,
        minPowerKw: 0.5,
        maxPowerKw: 3.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.062,
        efficiency: 48,
        parasiticLoss: 0.07,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 2900,
        datasheetUrl: "https://www.horizonfuelcell.com/products",
        source: "Horizon Fuel Cell Technologies",
        telecomApplication: "Cost-effective telecom backup. Popular in emerging markets. Simple maintenance, modular hot-swap capability.",
        referenceUrl: "https://www.horizonfuelcell.com/hseries"
      },
      {
        manufacturer: "Horizon",
        model: "H-5000",
        type: "PEMFC",
        ratedPowerKw: 5.0,
        minPowerKw: 1.0,
        maxPowerKw: 5.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.059,
        efficiency: 51,
        parasiticLoss: 0.07,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 2700,
        datasheetUrl: "https://www.horizonfuelcell.com/products",
        source: "Horizon Fuel Cell Technologies",
        telecomApplication: "Standard telecom tower backup. Field-proven in Asia-Pacific. Integrated BMS and hydrogen management.",
        referenceUrl: "https://www.fuelcellearth.com/fuel-cell-products/horizon-5000w-pem-fuel-cell/"
      },
      // === NEDSTACK ===
      {
        manufacturer: "Nedstack",
        model: "PemGen MT-FCPI-30",
        type: "PEMFC",
        ratedPowerKw: 30.0,
        minPowerKw: 6.0,
        maxPowerKw: 30.0,
        outputVoltageV: 48,
        fuelConsumptionPerKwh: 0.050,
        efficiency: 60,
        parasiticLoss: 0.10,
        fuelType: "Hydrogen",
        lhv: 33.3,
        capexPerKw: 2500,
        datasheetUrl: "https://www.nedstack.com/en/pemgen-solutions",
        source: "Nedstack Fuel Cell Technology",
        telecomApplication: "High-capacity sites, co-location facilities. Industrial-grade reliability. CHP capability for combined heat and power.",
        referenceUrl: "https://nedstack.com/en/pemgen-solutions/stationary-fuel-cell-power-systems"
      },
    ];

    for (const fc of fuelCellData) {
      await storage.createFuelCell(fc);
    }
    console.log("Seeded fuel cell database with verified telecom-focused modules");
  }
}
