import { NextRequest } from 'next/server';
import { TaskService } from '@/lib/services/task.service';
import { authenticateRequest } from '@/lib/middleware/auth-middleware';
import { handleApiError, createSuccessResponse } from '@/lib/utils/error-handler';

// POST /api/tasks/[id]/toggle - Toggle task status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;
    const { id: taskId } = await params;

    const task = await TaskService.toggleTaskStatus(userId, taskId);
    return createSuccessResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}
