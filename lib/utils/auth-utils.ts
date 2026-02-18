import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { envVars } from "@/lib/env";

const JWT_SECRET = new TextEncoder().encode(envVars.JWT_SECRET);
const JWT_REFRESH_SECRET = new TextEncoder().encode(envVars.JWT_REFRESH_SECRET);

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

export const generateAccessToken = async (payload: { userId: string }): Promise<string> => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m") // Short-lived access token
        .sign(JWT_SECRET);
};

export const generateRefreshToken = async (payload: { userId: string }): Promise<string> => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // Long-lived refresh token
        .sign(JWT_REFRESH_SECRET);
};

export const verifyAccessToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: string };
    } catch (err) {
        return null;
    }
};

export const verifyRefreshToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
        return payload as { userId: string };
    } catch (err) {
        return null;
    }
};
