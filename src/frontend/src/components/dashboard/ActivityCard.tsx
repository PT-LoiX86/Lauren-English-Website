import { BookOpen, Brain, Clock } from "lucide-react";
import { format } from "date-fns";
import type { ActivityDTO } from "@/types/dashboard-dto";
import { Link } from "react-router-dom";

export function ActivityCard({ activity }: { activity: ActivityDTO }) {
  const config = {
    PERIOD: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
    TEST: { icon: Clock, color: "text-red-500", bg: "bg-red-50" },
    REVIEW: { icon: Brain, color: "text-emerald-500", bg: "bg-emerald-50" },
  };

  const { icon: Icon, color, bg } = config[activity.type];

  const getTargetUrl = () => {
    switch (activity.type) {
      case "PERIOD":
        // Navigates to: /classrooms/123
        return `/classrooms/${activity.referenceId || "placeholder-class-id"}`;
      case "TEST":
        // Navigates to: /tests/456
        return `/tests/${activity.referenceId || "placeholder-test-id"}`;
      case "REVIEW":
        // Word reviews go straight to the dedicated vocabulary page
        return `/dictionary/vocabulary`;
      default:
        return "/dashboard";
    }
  };

  return (
    <Link
      to={getTargetUrl()}
      className="group flex items-start gap-4 p-3 rounded-lg border border-gray-100 bg-white transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
    >
      {/* Icon Badge */}
      <div
        className={`p-2 rounded-md shrink-0 mt-0.5 transition-colors ${bg} group-hover:bg-white group-hover:shadow-sm`}
      >
        <Icon className={`h-4 w-4 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate transition-colors group-hover:text-blue-600">
          {activity.title}
        </h4>

        {activity.classroomName && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            <span className="font-medium text-gray-700">
              {activity.classroomName}
            </span>
          </p>
        )}

        {activity.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {activity.description}
          </p>
        )}
      </div>

      {/* Time */}
      <div className="text-right shrink-0">
        <span className="text-xs font-medium text-gray-900 block group-hover:text-blue-600 transition-colors">
          {format(activity.timestamp, "HH:mm")}
        </span>
        <span className="text-[10px] text-gray-500 block uppercase">
          {format(activity.timestamp, "MMM dd")}
        </span>
      </div>
    </Link>
  );
}
