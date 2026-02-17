import { userRepo } from "@/repositories/user.repo";
import { hashPassword, generateAccessToken, generateRefreshToken } from "@/src/lib/auth-utils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const existingUser = await userRepo.findByEmail(email);

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const newUser = await userRepo.create({
            email,
            passwordHash,
            name: name || null,
        });

        // Generate tokens
        const accessToken = await generateAccessToken({ userId: newUser.id });
        const refreshToken = await generateRefreshToken({ userId: newUser.id });

        // Store refresh token in DB
        await userRepo.storeRefreshToken({
            userId: newUser.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Set refresh token in cookie
        const cookieStore = await cookies();
        cookieStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
            accessToken,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
