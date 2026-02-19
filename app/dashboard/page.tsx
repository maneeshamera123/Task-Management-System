import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/utils/auth-utils";
import { envVars } from "@/lib/env";
import { Status, Priority } from "@/lib/utils/client-task";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TaskFilters } from "@/components/dashboard/TaskFilters";
import { TaskList } from "@/components/dashboard/TaskList";

interface DashboardProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    priority?: string;
    search?: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const resolvedSearchParams = await searchParams;
  // Verify authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) {
    redirect("/login");
  }

  // Parse query parameters
  const page = parseInt(resolvedSearchParams.page || "1");
  const limit = 10;
  const status = (resolvedSearchParams.status as Status) || "all";
  const priority = (resolvedSearchParams.priority as Priority) || "all";
  const search = resolvedSearchParams.search || "";
  const baseUrl = envVars.NEXT_PUBLIC_APP_URL;

  // Build query parameters for the tasks API
  const tasksParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status !== "all") tasksParams.append("status", status);
  if (priority !== "all") tasksParams.append("priority", priority);
  if (search.trim()) tasksParams.append("search", search.trim());

  // Fetch data via API routes
  const [tasksRes, statsRes] = await Promise.all([
    fetch(`${baseUrl}/api/tasks?${tasksParams.toString()}`, {
      headers: { Cookie: `auth-token=${token}` },
    }),
    fetch(`${baseUrl}/api/tasks/stats`, {
      headers: { Cookie: `auth-token=${token}` },
    }),
  ]);

  if (!tasksRes.ok || !statsRes.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const [tasksData, stats] = await Promise.all([
    tasksRes.json(),
    statsRes.json(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <StatsCards stats={stats} />
        <TaskFilters />
        <TaskList
          tasks={tasksData.tasks}
          pagination={tasksData.pagination}
        />
      </div>
    </div>
  );
}
