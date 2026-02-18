import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq, and, like, desc, asc, ilike } from 'drizzle-orm';
import { NewTask, Task } from '@/lib/db/schema';
import { TaskListOptions, PaginatedTasks } from '@/lib/types/task';

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

    // Get total count for pagination
    const totalCount = await db
      .select({ count: tasks.id })
      .from(tasks)
      .where(and(...conditions))
      .then(result => result.length);

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
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    return result.rowCount > 0;
  }

  // Toggle task status (pending <-> in-progress <-> completed)
  static async toggleTaskStatus(userId: string, taskId: string): Promise<Task | null> {
    const task = await this.getTaskById(userId, taskId);

    if (!task) {
      return null;
    }

    let newStatus: 'pending' | 'in-progress' | 'completed';

    switch (task.status) {
      case 'pending':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }

    return await this.updateTask(userId, taskId, { status: newStatus });
  }

  // Get task statistics for a user
  static async getTaskStats(userId: string) {
    const userTasks = await db
      .select({
        status: tasks.status,
        priority: tasks.priority,
      })
      .from(tasks)
      .where(eq(tasks.userId, userId));

    const stats = {
      total: userTasks.length,
      pending: userTasks.filter(t => t.status === 'pending').length,
      inProgress: userTasks.filter(t => t.status === 'in-progress').length,
      completed: userTasks.filter(t => t.status === 'completed').length,
      urgent: userTasks.filter(t => t.priority === 'urgent').length,
      high: userTasks.filter(t => t.priority === 'high').length,
      medium: userTasks.filter(t => t.priority === 'medium').length,
      low: userTasks.filter(t => t.priority === 'low').length,
    };

    return stats;
  }
}
