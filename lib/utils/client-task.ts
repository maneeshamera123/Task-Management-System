import { ClientAuthService } from "./client-auth";

// Task type definitions
export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: Date | string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  userId: string;
};

export type TaskStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
};

export type PaginatedTasks = {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type Status = "all" | "pending" | "in-progress" | "completed";
export type Priority = "all" | "low" | "medium" | "high" | "urgent";

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface TaskFilters {
  status?: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high" | "urgent";
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskListOptions extends TaskFilters, PaginationOptions { }

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
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

export class ClientTaskService {
  // Get tasks with pagination, filtering, and searching
  static async getTasks(options: TaskListOptions = {}): Promise<PaginatedTasks> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.status) params.append('status', options.status);
    if (options.search) params.append('search', options.search);
    if (options.priority) params.append('priority', options.priority);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    const url = `/api/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await ClientAuthService.authenticatedFetch(url);
    const data = await response.json();
    return data;
  }

  // Get a single task by ID
  static async getTaskById(taskId: string): Promise<Task> {
    const response = await ClientAuthService.authenticatedFetch(`/api/tasks/${taskId}`);
    const data = await response.json();
    return data;
  }

  // Create a new task
  static async createTask(data: CreateTaskData): Promise<Task> {
    const response = await ClientAuthService.authenticatedFetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create task');
    }

    return result;
  }

  // Update a task
  static async updateTask(taskId: string, data: UpdateTaskData): Promise<Task> {
    const response = await ClientAuthService.authenticatedFetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update task');
    }

    return result;
  }

  // Delete a task
  static async deleteTask(taskId: string): Promise<void> {
    const response = await ClientAuthService.authenticatedFetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to delete task');
    }
  }

  // Toggle task status
  static async toggleTaskStatus(taskId: string): Promise<Task> {
    const response = await ClientAuthService.authenticatedFetch(`/api/tasks/${taskId}/toggle`, {
      method: 'POST',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to toggle task status');
    }

    return result;
  }

  // Get task statistics
  static async getTaskStats(): Promise<TaskStats> {
    const response = await ClientAuthService.authenticatedFetch('/api/tasks/stats');
    const data = await response.json();
    return data;
  }

  // Search and filter helpers
  static async searchTasks(query: string, options?: TaskListOptions): Promise<PaginatedTasks> {
    return this.getTasks({ ...options, search: query });
  }

  static async getTasksByStatus(status: 'pending' | 'in-progress' | 'completed', options?: TaskListOptions): Promise<PaginatedTasks> {
    return this.getTasks({ ...options, status });
  }

  static async getTasksByPriority(priority: 'low' | 'medium' | 'high' | 'urgent', options?: TaskListOptions): Promise<PaginatedTasks> {
    return this.getTasks({ ...options, priority });
  }

  // Date-based queries
  static async getTasksDueToday(): Promise<PaginatedTasks> {
    const today = new Date().toISOString().split('T')[0];
    return this.getTasks({ 
      sortBy: 'dueDate',
      sortOrder: 'asc'
    }).then(result => ({
      ...result,
      tasks: result.tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === today;
      })
    }));
  }

  static async getOverdueTasks(): Promise<PaginatedTasks> {
    const now = new Date();
    return this.getTasks({ 
      status: 'pending',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    }).then(result => ({
      ...result,
      tasks: result.tasks.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < now;
      })
    }));
  }
}
