"use client";

import { Plus, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your tasks efficiently</p>
                </div>
                <div className="flex gap-2">
                    <Button className="shrink-0">
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                    </Button>
                    <Button className="shrink-0">
                        <LogOutIcon className="h-4 w-4 mr-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
