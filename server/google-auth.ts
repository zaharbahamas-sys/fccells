import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { appUsers } from "@shared/schema";
import { eq } from "drizzle-orm";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function getRedirectUri(req: Request): string {
  const host = req.headers.host || process.env.REPLIT_DEV_DOMAIN || "localhost:5000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}/api/auth/google/callback`;
}

export function registerGoogleAuthRoutes(app: Express) {
  app.get("/api/auth/google", (req: Request, res: Response) => {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: "Google Client ID not configured" });
    }

    const redirectUri = getRedirectUri(req);
    const scope = encodeURIComponent("openid email profile");
    const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString("base64");
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;

    res.redirect(authUrl);
  });

  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    const { code, error } = req.query;

    if (error) {
      console.error("Google OAuth error:", error);
      return res.redirect("/?error=google_auth_failed");
    }

    if (!code || typeof code !== "string") {
      return res.redirect("/?error=no_code");
    }

    try {
      const redirectUri = getRedirectUri(req);
      
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error("Token exchange failed:", errorData);
        return res.redirect("/?error=token_exchange_failed");
      }

      const tokens = await tokenResponse.json();
      const { access_token, id_token } = tokens;

      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!userInfoResponse.ok) {
        return res.redirect("/?error=userinfo_failed");
      }

      const googleUser = await userInfoResponse.json();
      const { email, name, picture, given_name, family_name } = googleUser;

      let user = await db.select().from(appUsers).where(eq(appUsers.email, email)).then(rows => rows[0]);

      if (!user) {
        const [newUser] = await db.insert(appUsers).values({
          email,
          firstName: given_name || name?.split(" ")[0] || "User",
          lastName: family_name || name?.split(" ").slice(1).join(" ") || "",
          passwordHash: "",
          role: "user",
          status: "active",
          profilePhoto: picture,
        }).returning();
        user = newUser;
      } else if (picture && !user.profilePhoto) {
        await db.update(appUsers).set({ profilePhoto: picture }).where(eq(appUsers.id, user.id));
        user.profilePhoto = picture;
      }

      const sessionData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        profilePhoto: user.profilePhoto,
      };

      (req as any).session = (req as any).session || {};
      (req as any).session.user = sessionData;

      res.redirect(`/?auth=success&user=${encodeURIComponent(JSON.stringify(sessionData))}`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect("/?error=callback_failed");
    }
  });

  app.get("/api/auth/user", (req: Request, res: Response) => {
    const session = (req as any).session;
    if (session?.user) {
      return res.json(session.user);
    }
    return res.status(401).json({ error: "Not authenticated" });
  });

  app.get("/api/logout", (req: Request, res: Response) => {
    if ((req as any).session) {
      (req as any).session.destroy?.(() => {});
      (req as any).session = null;
    }
    res.redirect("/");
  });
}
