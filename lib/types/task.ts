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