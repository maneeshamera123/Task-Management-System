import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Task, CreateTaskData, UpdateTaskData } from '@/lib/utils/client-task';

interface UseTaskOperationsOptions {
  onSuccess?: (message?: string) => void;
  onError?: (error: Error) => void;
  refreshOnSuccess?: boolean;
}

export function useTaskOperations(options: UseTaskOperationsOptions = {}) {
  const router = useRouter();
  const { 
    onSuccess = (message) => message && toast.success(message), 
    onError = (error) => toast.error(error.message),
    refreshOnSuccess = true 
  } = options;

  const createTask = async (data: CreateTaskData): Promise<Task> => {
    try {
      const { ClientTaskService } = await import('@/lib/utils/client-task');
      const task = await ClientTaskService.createTask(data);
      
      if (refreshOnSuccess) {
        router.refresh();
      }
      
      onSuccess('Task created successfully');
      return task;
    } catch (error) {
      onError(error as Error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
    try {
      const { ClientTaskService } = await import('@/lib/utils/client-task');
      const task = await ClientTaskService.updateTask(taskId, data);
      
      if (refreshOnSuccess) {
        router.refresh();
      }
      
      onSuccess('Task updated successfully');
      return task;
    } catch (error) {
      onError(error as Error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      const { ClientTaskService } = await import('@/lib/utils/client-task');
      await ClientTaskService.deleteTask(taskId);
      
      if (refreshOnSuccess) {
        router.refresh();
      }
      
      onSuccess('Task deleted successfully');
    } catch (error) {
      onError(error as Error);
      throw error;
    }
  };

  const toggleTaskStatus = async (taskId: string): Promise<Task> => {
    try {
      const { ClientTaskService } = await import('@/lib/utils/client-task');
      const task = await ClientTaskService.toggleTaskStatus(taskId);
      
      if (refreshOnSuccess) {
        router.refresh();
      }
      
      onSuccess(`Task status updated to ${task.status.replace('-', ' ')}`);
      return task;
    } catch (error) {
      onError(error as Error);
      throw error;
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
