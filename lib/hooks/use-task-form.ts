import { useState } from 'react';
import { CreateTaskData, UpdateTaskData, Task } from '@/lib/utils/client-task';

interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
}

interface UseTaskFormOptions {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
  initialTask?: Task;
}

export function useTaskForm(options: UseTaskFormOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>(() => ({
    title: options.initialTask?.title || '',
    description: options.initialTask?.description || '',
    status: options.initialTask?.status || 'pending',
    priority: options.initialTask?.priority || 'medium',
    dueDate: options.initialTask?.dueDate 
      ? new Date(options.initialTask.dueDate).toISOString().slice(0, 16) 
      : '',
  }));

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    });
  };

  const setInitialData = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate 
        ? new Date(task.dueDate).toISOString().slice(0, 16) 
        : '',
    });
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }

    if (formData.title.trim().length < 3) {
      return 'Title must be at least 3 characters long';
    }

    if (formData.title.trim().length > 100) {
      return 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      return 'Description must be less than 500 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      if (isNaN(dueDate.getTime())) {
        return 'Invalid due date format';
      }
      if (dueDate < new Date() && formData.status !== 'completed') {
        return 'Due date cannot be in the past for pending or in-progress tasks';
      }
    }

    return null;
  };

  const getSubmitData = (): CreateTaskData => {
    const data: CreateTaskData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
    };

    if (formData.dueDate) {
      data.dueDate = new Date(formData.dueDate);
    }

    return data;
  };

  const isValid = formData.title.trim().length > 0;

  return {
    formData,
    loading,
    isValid,
    setLoading,
    resetForm,
    setInitialData,
    handleInputChange,
    validateForm,
    getSubmitData,
  };
}
