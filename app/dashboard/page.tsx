import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
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
  let token = cookieStore.get("auth-token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token) {
    redirect("/login");
  }

  // Check if access token is expired
  const payload = await verifyAccessToken(token);
  if (!payload || !payload.userId) {
    // Try to refresh the token if we have a refresh token
    if (refreshToken) {
      try {
        // Call the refresh API endpoint
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { Cookie: `refreshToken=${refreshToken}` },
          credentials: "include",
        });
        
        if (refreshRes.ok) {
          // Get the new token from cookies
          const newCookieStore = await cookies();
          token = newCookieStore.get("auth-token")?.value;
        } else {
          redirect("/login");
        }
      } catch (error) {
        redirect("/login");
      }
    } else {
      redirect("/login");
    }
    
    // Verify the new token
    const newPayload = await verifyAccessToken(token || "");
    if (!newPayload || !newPayload.userId) {
      redirect("/login");
    }
  }

  // Parse query parameters
  const page = parseInt(resolvedSearchParams.page || "1");
  const limit = 10;
  const status = (resolvedSearchParams.status as Status) || "all";
  const priority = (resolvedSearchParams.priority as Priority) || "all";
  const search = resolvedSearchParams.search || "";
  
  // Get base URL for server-side fetch
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

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
      credentials: "include",
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/tasks/stats`, {
      headers: { Cookie: `auth-token=${token}` },
      credentials: "include",
      cache: "no-store",
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
