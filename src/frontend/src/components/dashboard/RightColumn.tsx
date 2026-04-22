import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardCalendar } from "./DashboardCalendar";
import { ActivityCard } from "./ActivityCard";
import type { ActivityDTO } from "@/types/dashboard-dto";
import { isToday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/Client";
import { useAuthStore } from "@/stores/AuthStore";

export function RightColumn() {
  const { user } = useAuthStore();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["dashboardActivities", user?.userId],
    queryFn: async () => {
      const response = await apiClient.get<ActivityDTO[]>(
        "/dashboard/activities",
      );

      return response.data.map((activity) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      }));
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const todayActivities = activities.filter((a) => isToday(a.timestamp));

  const upcomingActivities = activities
    .filter((a) => !isToday(a.timestamp))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(0, 10);

  return (
    <aside className="w-full xl:w-96 flex flex-col gap-6">
      {/* Calendar Section */}
      <div className="flex justify-center w-full">
        <DashboardCalendar activities={activities} />
      </div>

      {/* Today Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Today
        </h3>
        <ScrollArea className="h-[320px] rounded-xl border border-gray-100 bg-gray-50/50 p-2">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <p className="text-sm text-gray-500 text-center py-8 animate-pulse">
                Loading schedule...
              </p>
            ) : todayActivities.length > 0 ? (
              todayActivities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No activities scheduled for today.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Upcoming Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Upcoming
        </h3>
        <ScrollArea className="h-[320px] rounded-xl border border-gray-100 bg-gray-50/50 p-2">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <p className="text-sm text-gray-500 text-center py-8 animate-pulse">
                Loading schedule...
              </p>
            ) : upcomingActivities.length > 0 ? (
              upcomingActivities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No upcoming activities.
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
