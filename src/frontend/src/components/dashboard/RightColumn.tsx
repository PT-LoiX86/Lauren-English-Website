import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardCalendar } from "./DashboardCalendar";
import { ActivityCard } from "./ActivityCard";
import type { ActivityDTO } from "@/types/dashboard-dto";
import { isToday } from "date-fns";

// TEMPORARY MOCK DATA
const mockActivities: ActivityDTO[] = [
  {
    id: "1",
    type: "TEST",
    title: "Midterm Exam",
    classroomName: "Advanced English 101",
    description: "Chapters 1-5 review.",
    timestamp: new Date(),
    referenceId: "test-789",
  },
  {
    id: "2",
    type: "PERIOD",
    title: "Speaking Practice",
    classroomName: "IELTS Prep",
    timestamp: new Date(new Date().setHours(14)),
    referenceId: "class-123",
  },
  {
    id: "3",
    type: "REVIEW",
    title: "Word review",
    description: "45 words",
    timestamp: new Date(),
  },
  // Incoming
  {
    id: "4",
    type: "PERIOD",
    title: "Grammar Deep Dive",
    classroomName: "Advanced English 101",
    timestamp: new Date(Date.now() + 86400000 * 2),
    referenceId: "class-123",
  },
  {
    id: "5",
    type: "TEST",
    title: "Vocabulary Quiz",
    classroomName: "IELTS Prep",
    timestamp: new Date(Date.now() + 86400000 * 3),
    referenceId: "test-999",
  },
];

export function RightColumn() {
  const todayActivities = mockActivities.filter((a) => isToday(a.timestamp));
  const incomingActivities = mockActivities
    .filter((a) => !isToday(a.timestamp))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(0, 10);

  return (
    <aside className="w-full xl:w-96 flex flex-col gap-6">
      {/* Calendar Section */}
      <div className="flex justify-center w-full">
        <DashboardCalendar activities={mockActivities} />
      </div>

      {/* Today Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Today
        </h3>
        <ScrollArea className="h-[320px] rounded-xl border border-gray-100 bg-gray-50/50 p-2">
          <div className="flex flex-col gap-2">
            {todayActivities.length > 0 ? (
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

      {/* Incoming Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Incoming
        </h3>
        <ScrollArea className="h-[320px] rounded-xl border border-gray-100 bg-gray-50/50 p-2">
          <div className="flex flex-col gap-2">
            {incomingActivities.length > 0 ? (
              incomingActivities.map((act) => (
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
