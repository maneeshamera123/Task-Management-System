import { db } from "@/lib/db";
import { users, refreshTokens } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export const userRepo = {
  // Find user by email
  async findByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  // Create new user
  async create(userData: {
    email: string;
    passwordHash: string;
    name?: string | null;
  }) {
    const [newUser] = await db.insert(users).values(userData).returning();
    return newUser;
  },

  // Store refresh token
  async storeRefreshToken(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) {
    await db.insert(refreshTokens).values(data);
  },

  // Find refresh token by token value
  async findRefreshToken(token: string) {
    return await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date())
      ),
    });
  },

  // Delete refresh token by token value
  async deleteRefreshToken(token: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  },
};
