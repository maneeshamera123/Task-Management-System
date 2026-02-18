import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "in-progress":
            return <Clock className="h-4 w-4 text-blue-500" />;
        default:
            return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        case "in-progress":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        default:
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
};

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "urgent":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        case "high":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        case "medium":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
};
