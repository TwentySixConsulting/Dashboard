import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcrypt";
import ExcelJS from "exceljs";
import passport from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertClientRoleSchema } from "@shared/schema";
import { pool } from "./db";
import { z } from "zod";

const PgSession = connectPgSimple(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      store: new PgSession({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "twentysix-reward-session-secret-2026",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(parsed.email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }
      const hashedPassword = await bcrypt.hash(parsed.password, 10);
      const user = await storage.createUser({
        ...parsed,
        email: parsed.email.toLowerCase(),
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after signup" });
        const { password, ...safeUser } = user;
        return res.json({ user: safeUser });
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Please check your details and try again", errors: err.errors });
      }
      return res.status(500).json({ message: err.message || "Something went wrong" });
    }
  });

  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...safeUser } = user;
        return res.json({ user: safeUser });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...safeUser } = req.user!;
    res.json({ user: safeUser });
  });

  app.post("/api/roles", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const rolesData = z.array(insertClientRoleSchema.omit({ userId: true })).parse(req.body.roles);
      const rolesWithUser = rolesData.map((r) => ({ ...r, userId: req.user!.id }));
      const created = await storage.replaceClientRoles(req.user!.id, rolesWithUser);
      res.json({ roles: created });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: err.errors });
      }
      return res.status(500).json({ message: err.message || "Failed to save roles" });
    }
  });

  app.get("/api/roles", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const roles = await storage.getClientRoles(req.user!.id);
    res.json({ roles });
  });

  app.get("/api/template/roles", async (_req: Request, res: Response) => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "TwentySix Reward Consultancy";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Role Data");

      sheet.columns = [
        { header: "Role Title", key: "roleTitle", width: 28 },
        { header: "Current FTE Salary", key: "salary", width: 22 },
        { header: "Experience Level", key: "experience", width: 28 },
        { header: "Function/Job Family", key: "function", width: 28 },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, size: 11 };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8E8E8" },
      };
      headerRow.alignment = { vertical: "middle", horizontal: "left" };
      headerRow.height = 22;

      headerRow.eachCell((cell) => {
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        };
      });

      for (let i = 2; i <= 51; i++) {
        sheet.addRow(["", "", "", ""]);
      }

      const refSheet = workbook.addWorksheet("_Options");
      refSheet.state = "veryHidden";
      const options = [
        "Entry or Foundation",
        "Early and Developing",
        "Mid to Senior",
        "Experts, Strategists & Leaders",
      ];
      options.forEach((opt, i) => {
        refSheet.getCell(`A${i + 1}`).value = opt;
      });

      for (let i = 2; i <= 51; i++) {
        sheet.getCell(`C${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: ["_Options!$A$1:$A$4"],
          showErrorMessage: true,
          errorTitle: "Invalid Experience Level",
          error: "Please select from the dropdown list.",
        };
      }

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=twentysix-role-template.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } catch (err: any) {
      res.status(500).json({ message: "Failed to generate template" });
    }
  });

  return httpServer;
}
