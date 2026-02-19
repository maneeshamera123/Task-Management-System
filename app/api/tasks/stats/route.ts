import { NextRequest } from 'next/server';
import { TaskService } from '@/lib/services/task.service';
import { authenticateRequest } from '@/lib/middleware/auth-middleware';
import { handleApiError, createSuccessResponse } from '@/lib/utils/error-handler';

// GET /api/tasks/stats - Get task statistics for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = await authenticateRequest(request);
    const userId = authenticatedRequest.userId;

    const stats = await TaskService.getTaskStats(userId);
    return createSuccessResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
