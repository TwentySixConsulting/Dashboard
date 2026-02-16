import { eq } from "drizzle-orm";
import { db, pool } from "./db";
import { users, clientRoles, type User, type InsertUser, type ClientRole, type InsertClientRole } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getClientRoles(userId: number): Promise<ClientRole[]>;
  createClientRoles(roles: InsertClientRole[]): Promise<ClientRole[]>;
  replaceClientRoles(userId: number, roles: InsertClientRole[]): Promise<ClientRole[]>;
  deleteClientRoles(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getClientRoles(userId: number): Promise<ClientRole[]> {
    return db.select().from(clientRoles).where(eq(clientRoles.userId, userId));
  }

  async createClientRoles(roles: InsertClientRole[]): Promise<ClientRole[]> {
    if (roles.length === 0) return [];
    return db.insert(clientRoles).values(roles).returning();
  }

  async replaceClientRoles(userId: number, roles: InsertClientRole[]): Promise<ClientRole[]> {
    return db.transaction(async (tx) => {
      await tx.delete(clientRoles).where(eq(clientRoles.userId, userId));
      if (roles.length === 0) return [];
      return tx.insert(clientRoles).values(roles).returning();
    });
  }

  async deleteClientRoles(userId: number): Promise<void> {
    await db.delete(clientRoles).where(eq(clientRoles.userId, userId));
  }
}

export const storage = new DatabaseStorage();
