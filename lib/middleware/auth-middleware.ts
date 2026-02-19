import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/auth-utils';
import { AuthService } from '@/lib/services/auth.service';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedRequest> {
  // Try to get token from cookies first 
  let token = request.cookies.get('auth-token')?.value;
  
  // Fallback to Authorization header for API clients
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    throw new Error('Unauthorized: No authentication token provided');
  }

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) {
    throw new Error('Unauthorized: Invalid or expired token');
  }

  // Add userId to request object
  (request as AuthenticatedRequest).userId = payload.userId;
  return request as AuthenticatedRequest;
}

export function getAuthenticatedUserId(request: NextRequest): string {
  const authenticatedRequest = request as AuthenticatedRequest;
  if (!authenticatedRequest.userId) {
    throw new Error('Request not authenticated');
  }
  return authenticatedRequest.userId;
}
