'use client';

import { useState } from 'react';
import { Edit, Trash2, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/utils/client-task";
import { getStatusIcon, getStatusColor, getPriorityColor } from "@/lib/utils/task-utils";
import { ViewTaskDialog } from "./ViewTaskDialog";
import { useTaskOperations } from "@/lib/hooks/use-task-operations";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const [isToggling, setIsToggling] = useState(false);
    
    const { deleteTask, toggleTaskStatus } = useTaskOperations({
        refreshOnSuccess: true,
    });

    const handleDelete = async () => {
        try {
            await deleteTask(task.id);
        } catch (error) {
            // Error is handled by useTaskOperations hook
        }
    };

    const handleToggle = async () => {
        setIsToggling(true);
        try {
            await toggleTaskStatus(task.id);
        } catch (error) {
            // Error is handled by useTaskOperations hook
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={handleToggle}
                            disabled={isToggling}
                            className="mt-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={`Click to toggle status (current: ${task.status.replace('-', ' ')})`}
                        >
                            {getStatusIcon(task.status)}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                {task.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {task.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status.replace("-", " ")}
                                </span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                {task.dueDate && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Due: {new Date(task.dueDate).toLocaleString('en-IN', {
                                            timeZone: 'Asia/Kolkata',
                                            day: 'numeric',
                                            month: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <ViewTaskDialog task={task}>
                        <Button variant="outline" size="icon-sm">
                            <View className="h-2 w-2" />
                        </Button>
                    </ViewTaskDialog>
                    <ViewTaskDialog task={task} isEditable={true}>
                        <Button size="icon-sm">
                            <Edit className="h-2 w-2" />
                        </Button>
                    </ViewTaskDialog>
                    <Button variant="destructive" size="icon-sm" onClick={handleDelete}>
                        <Trash2 className="h-2 w-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
