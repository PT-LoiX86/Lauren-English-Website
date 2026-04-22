import { format, formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import type { ClassPeriodDTO } from "@/types/dashboard-dto";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  period?: ClassPeriodDTO;
  isLoading?: boolean;
}

export function NextPeriodCard({ period, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-xl" />;
  }

  if (!period) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 min-h-[200px] flex flex-col justify-center items-center">
        <Clock className="h-8 w-8 mb-2 text-gray-400" />
        <p>No upcoming classes! Enjoy your free time.</p>
      </div>
    );
  }

  return (
    <Link
      to={`/classrooms/${period.id}`}
      className="group block relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 min-h-[200px] flex flex-col"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-110" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
            UPCOMING
          </span>
          <span className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Starts in {formatDistanceToNow(period.startTime)}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1 group-hover:text-blue-100 transition-colors">
          {period.classroomName}
        </h2>

        <p className="text-blue-200/80 text-sm mb-6">{period.lessonContent}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="leading-none pt-[1px]">
              {format(period.startTime, "EEEE, MMMM do 'at' h:mm a")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
