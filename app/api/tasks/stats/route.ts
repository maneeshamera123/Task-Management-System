import { NextRequest, NextResponse } from 'next/server';
import { TaskRepository } from '@/repositories/task.repo';
import { verifyAccessToken } from '@/lib/utils/auth-utils';

// GET /api/tasks/stats - Get task statistics for the logged-in user
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get task statistics
    const stats = await TaskRepository.getTaskStats(payload.userId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
