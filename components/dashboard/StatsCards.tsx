import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { TaskStats } from "@/lib/types/task";

interface StatsCardsProps {
    stats: TaskStats | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats?.total || 0}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats?.completed || 0}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats?.inProgress || 0}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats?.pending || 0}</p>
                    </div>
                    <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
