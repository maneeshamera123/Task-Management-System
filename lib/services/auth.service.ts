import { userRepo } from "@/repositories/user.repo";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/auth-utils";
import { cookies } from "next/headers";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokenStorageOptions {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {

  static async generateAndStoreTokens(userId: string): Promise<AuthTokens> {
    const accessToken = await generateAccessToken({ userId });
    const refreshToken = await generateRefreshToken({ userId });

    // Store refresh token in database
    await userRepo.storeRefreshToken({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { accessToken, refreshToken };
  }

  static async setAuthCookies(tokens: AuthTokens): Promise<void> {
    const cookieStore = await cookies();
    
    // Set refresh token cookie (7 days)
    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    // Set access token cookie (15 minutes)
    cookieStore.set("auth-token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, 
    });
  }

  static async clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete("auth-token");
  }

  static async completeAuth(userId: string): Promise<AuthTokens> {
    const tokens = await this.generateAndStoreTokens(userId);
    await this.setAuthCookies(tokens);
    return tokens;
  }

  static async getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value;
  }

  static async getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("auth-token")?.value;
  }
}
