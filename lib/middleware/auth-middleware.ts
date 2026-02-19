import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/auth-utils';
import { AuthService } from '@/lib/services/auth.service';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedRequest> {
  // Try to get token from cookies first 
  let token = request.cookies.get('auth-token')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
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

  // Check if access token is expired
  let payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) {
    // Try to refresh the token if we have a refresh token
    if (refreshToken) {
      try {
        // Create a new request for refresh (copy headers and cookies)
        const refreshUrl = new URL('/api/auth/refresh', request.url);
        const refreshResponse = await fetch(refreshUrl.toString(), {
          method: 'POST',
          headers: {
            'Cookie': `refreshToken=${refreshToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (refreshResponse.ok) {
          // Extract new token from response cookies
          const setCookieHeader = refreshResponse.headers.get('set-cookie');
          if (setCookieHeader) {
            const tokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
            if (tokenMatch) {
              token = tokenMatch[1];
            }
          }
        } else {
          throw new Error('Unauthorized: Token refresh failed');
        }
      } catch (error) {
        throw new Error('Unauthorized: Token refresh failed');
      }
    } else {
      throw new Error('Unauthorized: No refresh token available');
    }
    
    // Verify the new token
    payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      throw new Error('Unauthorized: Refreshed token is invalid');
    }
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
