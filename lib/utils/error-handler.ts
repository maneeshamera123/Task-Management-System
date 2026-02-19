import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class AuthError extends ApiError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class TaskError extends ApiError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode, 'TASK_ERROR');
    this.name = 'TaskError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code 
      }, 
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Log the full error for debugging
    console.error("Unexpected error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        code: 'INTERNAL_ERROR'
      }, 
      { status: 500 }
    );
  }

  return NextResponse.json(
    { 
      error: "Unknown error occurred",
      code: 'UNKNOWN_ERROR'
    }, 
    { status: 500 }
  );
}

export function createAuthResponse(user: { id: string; email: string; name?: string | null }) {
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
