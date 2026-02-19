import { Calendar } from "lucide-react";
import { Task, PaginatedTasks } from "@/lib/utils/client-task";
import { TaskCard } from "./TaskCard";
import { Pagination } from "./Pagination";

interface TaskListProps {
    tasks: Task[];
    pagination: PaginatedTasks['pagination'] | null;
}

export function TaskList({ tasks, pagination }: TaskListProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tasks ({pagination?.total || 0})
                </h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 dark:text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4" />
                            <p className="text-lg font-medium">No tasks found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                )}
            </div>

            {pagination && <Pagination pagination={pagination} />}
        </div>
    );
}
