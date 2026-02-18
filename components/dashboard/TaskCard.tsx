import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types/task";

import { getStatusIcon, getStatusColor, getPriorityColor } from "@/lib/utils/task-utils";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {

    return (
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            {getStatusIcon(task.status)}
                        </div>
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
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
