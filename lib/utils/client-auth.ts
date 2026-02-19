// Client-side authentication utilities

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export class ClientAuthService {
  // Authenticate user with email and password
  static async login(credentials: LoginCredentials): Promise<{ user: AuthUser }> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  }

  // Register new user
  static async register(credentials: RegisterCredentials): Promise<{ user: AuthUser }> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  }

  // Logout user
  static async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Logout failed");
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<void> {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Token refresh failed");
    }
  }

  // Make authenticated API call with automatic token refresh
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let response = await fetch(url, options);

    // If unauthorized, try to refresh token and retry once
    if (response.status === 401) {
      try {
        await this.refreshToken();
        response = await fetch(url, options);
      } catch (refreshError) {
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }

    return response;
  }

  // Check if user is authenticated (basic check)
  static isAuthenticated(): boolean {
    // This is a basic client-side check For proper validation, server-side verification is needed
    return document.cookie.includes('auth-token=');
  }
}
