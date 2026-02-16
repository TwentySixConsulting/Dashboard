import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  organisationName: text("organisation_name").notNull(),
  industry: text("industry").notNull(),
  numberOfEmployees: integer("number_of_employees").notNull(),
  numberOfRoles: integer("number_of_roles").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientRoles = pgTable("client_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  roleTitle: text("role_title").notNull(),
  currentSalary: integer("current_salary").notNull(),
  experienceLevel: text("experience_level").notNull(),
  functionFamily: text("function_family").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertClientRoleSchema = createInsertSchema(clientRoles).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClientRole = z.infer<typeof insertClientRoleSchema>;
export type ClientRole = typeof clientRoles.$inferSelect;
