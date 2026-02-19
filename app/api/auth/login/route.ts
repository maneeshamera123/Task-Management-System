import { userRepo } from "@/repositories/user.repo";
import { comparePassword } from "@/lib/utils/auth-utils";
import { AuthService } from "@/lib/services/auth.service";
import { handleApiError, AuthError, ValidationError, createAuthResponse } from "@/lib/utils/error-handler";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            throw new ValidationError("Email and password are required");
        }

        // Find user
        const user = await userRepo.findByEmail(email);

        if (!user || !(await comparePassword(password, user.passwordHash || ""))) {
            throw new AuthError("Invalid credentials");
        }

        // Complete authentication flow
        await AuthService.completeAuth(user.id);

        return createAuthResponse(user);
    } catch (error) {
        return handleApiError(error);
    }
}
