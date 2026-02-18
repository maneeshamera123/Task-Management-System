"use client";

import { LogOutIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { NewTaskDialog } from "./NewTaskDialog";
import { toast } from "sonner";

export function DashboardHeader() {
    const router = useRouter();
    const handleLogout = async () => {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });
        if (res.ok) {
            toast.success("Logged out successfully");
            router.push("/login");
        }
    }
    return (
        <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your tasks efficiently</p>
                </div>
                <div className="flex gap-2">
                    <NewTaskDialog>
                        <Button className="shrink-0">
                            <Plus className="h-4 w-4" />
                            New Task
                        </Button>
                    </NewTaskDialog>
                    <Button className="shrink-0" onClick={() => { handleLogout() }}>
                        <LogOutIcon className="h-4 w-4 mr-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
