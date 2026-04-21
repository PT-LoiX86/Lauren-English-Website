import { format, formatDistanceToNow } from "date-fns";
import { Clock, ArrowRight } from "lucide-react";
import type { NextPeriodDTO } from "@/types/dashboard-dto";
import { Link } from "react-router-dom";

export function NextPeriodCard({ period }: { period: NextPeriodDTO | null }) {
  if (!period) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 h-[200px] flex flex-col justify-center items-center">
        <Clock className="h-8 w-8 mb-2 text-gray-400" />
        <p>No upcoming classes! Enjoy your free time.</p>
      </div>
    );
  }

  return (
    <Link
      to={`/classrooms/${period.id}`}
      className="group block relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform group-hover:scale-110" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
            INCOMING
          </span>
          <span className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
            Starts in {formatDistanceToNow(period.startTime)}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1 group-hover:text-blue-100 transition-colors">
          {period.classroomName}
        </h2>

        <p className="text-blue-100 text-sm mb-6">
          Period {period.periodNumber} • {period.lessonContent}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Clock className="h-4 w-4" />
            {format(period.startTime, "EEEE, MMMM do yyyy 'at' HH:mm")}
          </div>
          <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
