import { userRepo } from "@/repositories/user.repo";
import { hashPassword } from "@/lib/utils/auth-utils";
import { AuthService } from "@/lib/services/auth.service";
import { handleApiError, AuthError, ValidationError, createAuthResponse } from "@/lib/utils/error-handler";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            throw new ValidationError("Email and password are required");
        }

        const existingUser = await userRepo.findByEmail(email);

        if (existingUser) {
            throw new AuthError("User already exists", 400);
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const newUser = await userRepo.create({
            email,
            passwordHash,
            name: name || null,
        });

        // Complete authentication flow
        await AuthService.completeAuth(newUser.id);

        return createAuthResponse(newUser);
    } catch (error) {
        return handleApiError(error);
    }
}
