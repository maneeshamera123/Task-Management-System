import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and, desc, asc, ilike, count, sql } from 'drizzle-orm';
import { NewTask, Task } from '@/lib/db/schema';
import { TaskListOptions, PaginatedTasks } from '@/lib/utils/client-task';

export class TaskRepository {
  // Create a new task
  static async createTask(userId: string, taskData: Omit<NewTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...taskData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return task;
  }

  // Get tasks with pagination, filtering, and searching
  static async getTasks(
    userId: string,
    options: TaskListOptions = {}
  ): Promise<PaginatedTasks> {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build conditions
    const conditions = [eq(tasks.userId, userId)];

    if (status) {
      conditions.push(eq(tasks.status, status));
    }

    if (priority) {
      conditions.push(eq(tasks.priority, priority));
    }

    if (search) {
      conditions.push(
        ilike(tasks.title, `%${search}%`)
      );
    }

    // Apply sorting
    const orderColumn = {
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      dueDate: tasks.dueDate,
      title: tasks.title,
    }[sortBy];

    // Build the complete query
    const query = db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .where(and(...conditions))
      .orderBy(sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn));

    const [countResult] = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(...conditions));

    const totalCount = countResult?.count ?? 0;

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedQuery = query.limit(limit).offset(offset);

    const tasksList = await paginatedQuery;

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      tasks: tasksList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  // Get a single task by ID
  static async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    return task || null;
  }

  // Update a task
  static async updateTask(
    userId: string,
    taskId: string,
    updateData: Partial<Omit<NewTask, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Task | null> {
    const [task] = await db
      .update(tasks)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    return task || null;
  }

  // Delete a task
  static async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning({ id: tasks.id });

    return result.length > 0;
  }

  static async getTaskStats(userId: string) {
    const statusCounts = await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .groupBy(tasks.status);

    const priorityCounts = await db
      .select({
        priority: tasks.priority,
        count: count(),
      })
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .groupBy(tasks.priority);

    const getCount = (arr: { status?: string; priority?: string; count: number }[], key: string) =>
      arr.find(x => (x.status || x.priority) === key)?.count ?? 0;

    return {
      total: statusCounts.reduce((sum, r) => sum + r.count, 0),
      pending: getCount(statusCounts as any, 'pending'),
      inProgress: getCount(statusCounts as any, 'in-progress'),
      completed: getCount(statusCounts as any, 'completed'),
      urgent: getCount(priorityCounts as any, 'urgent'),
      high: getCount(priorityCounts as any, 'high'),
      medium: getCount(priorityCounts as any, 'medium'),
      low: getCount(priorityCounts as any, 'low'),
    };
  }
}
