import { NextRequest } from 'next/server';
import { TaskService } from '@/lib/services/task.service';
import { authenticateRequest } from '@/lib/middleware/auth-middleware';
import { handleApiError, createSuccessResponse } from '@/lib/utils/error-handler';

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;
    const { id: taskId } = await params;

    const task = await TaskService.getTaskById(userId, taskId);
    return createSuccessResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;
    const { id: taskId } = await params;

    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    const task = await TaskService.updateTask(userId, taskId, {
      title,
      description,
      status,
      priority,
      dueDate,
    });

    return createSuccessResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;
    const { id: taskId } = await params;

    await TaskService.deleteTask(userId, taskId);
    
    return createSuccessResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
