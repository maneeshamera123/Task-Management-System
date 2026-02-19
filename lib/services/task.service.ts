import { TaskRepository } from "@/repositories/task.repo";
import { NewTask } from "@/lib/db/schema";
import { Task, PaginatedTasks, TaskListOptions } from "@/lib/utils/client-task";

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string | Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string | Date | null;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

export class TaskService {
  // Create a new task for a user
  static async createTask(userId: string, data: CreateTaskData): Promise<Task> {
    this.validateCreateTaskData(data);

    const taskData: Omit<NewTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };

    return await TaskRepository.createTask(userId, taskData);
  }

  // Get tasks with pagination, filtering, and searching
  static async getTasks(userId: string, options: TaskListOptions = {}): Promise<PaginatedTasks> {
    this.validatePaginationParams(options);

    return await TaskRepository.getTasks(userId, options);
  }

  // Get a single task by ID
  static async getTaskById(userId: string, taskId: string): Promise<Task> {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const task = await TaskRepository.getTaskById(userId, taskId);
    
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  // Update a task
  static async updateTask(userId: string, taskId: string, data: UpdateTaskData): Promise<Task> {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    this.validateUpdateTaskData(data);

    const updateData: Partial<Omit<NewTask, 'id' | 'userId' | 'createdAt'>> = {};
    
    if (data.title !== undefined) {
      updateData.title = data.title.trim();
    }
    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const task = await TaskRepository.updateTask(userId, taskId, updateData);
    
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  // Delete a task
  static async deleteTask(userId: string, taskId: string): Promise<void> {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const success = await TaskRepository.deleteTask(userId, taskId);
    
    if (!success) {
      throw new Error("Task not found");
    }
  }

  // Toggle task status
  static async toggleTaskStatus(userId: string, taskId: string): Promise<Task> {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const task = await TaskRepository.toggleTaskStatus(userId, taskId);
    
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  // Get task statistics for a user
  static async getTaskStats(userId: string): Promise<TaskStats> {
    return await TaskRepository.getTaskStats(userId);
  }

  // Validation methods
  private static validateCreateTaskData(data: CreateTaskData): void {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      throw new Error("Title is required");
    }

    if (data.priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(data.priority)) {
        throw new Error("Invalid priority");
      }
    }

    if (data.dueDate) {
      const dueDateObj = new Date(data.dueDate);
      if (isNaN(dueDateObj.getTime())) {
        throw new Error("Invalid due date format");
      }
    }
  }

  private static validateUpdateTaskData(data: UpdateTaskData): void {
    if (data.status) {
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(data.status)) {
        throw new Error("Invalid status");
      }
    }

    if (data.priority) {
      const validPriorities = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(data.priority)) {
        throw new Error("Invalid priority");
      }
    }

    if (data.dueDate !== undefined && data.dueDate !== null) {
      const dueDateObj = new Date(data.dueDate);
      if (isNaN(dueDateObj.getTime())) {
        throw new Error("Invalid due date format");
      }
    }

    if (data.title !== undefined) {
      if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
        throw new Error("Title cannot be empty");
      }
    }
  }

  private static validatePaginationParams(options: TaskListOptions): void {
    const { page = 1, limit = 10 } = options;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new Error("Invalid pagination parameters");
    }
  }
}
