import { NextRequest } from 'next/server';
import { TaskService } from '@/lib/services/task.service';
import { authenticateRequest } from '@/lib/middleware/auth-middleware';
import { handleApiError, createSuccessResponse } from '@/lib/utils/error-handler';

// GET /api/tasks - Get tasks with pagination, filtering, and searching
export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const options = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      status: searchParams.get('status') as 'pending' | 'in-progress' | 'completed' | undefined,
      search: searchParams.get('search') || undefined,
      priority: searchParams.get('priority') as 'low' | 'medium' | 'high' | 'urgent' | undefined,
      sortBy: searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'dueDate' | 'title' || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc',
    };

    const result = await TaskService.getTasks(userId, options);
    return createSuccessResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;

    const body = await request.json();
    const { title, description, priority, dueDate } = body;

    const task = await TaskService.createTask(userId, {
      title,
      description,
      priority,
      dueDate,
    });

    return createSuccessResponse(task, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
