import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { isSameDay } from "date-fns";
import type { ActivityDTO } from "@/types/dashboard-dto";
import { ActivityCard } from "./ActivityCard";

export function DashboardCalendar({
  activities,
}: {
  activities: ActivityDTO[];
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-xl border bg-white shadow-sm p-3"
      components={{
        DayButton: (props) => {
          const dayDate = props.day.date;

          const dayActivities = activities.filter((a) =>
            isSameDay(a.timestamp, dayDate),
          );
          const hasEvents = dayActivities.length > 0;

          const {
            onClick,
            onKeyDown,
            onFocus,
            onBlur,
            onMouseEnter,
            onMouseLeave,
            disabled,
            className,
          } = props;

          const DayVisual = (
            <button
              onClick={onClick}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              disabled={disabled}
              className={`${className} relative flex h-9 w-9 items-center justify-center p-0 font-normal hover:bg-gray-100 rounded-md`}
            >
              <span>{dayDate.getDate()}</span>
              {/* The Event Dot */}
              {hasEvents && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-500" />
              )}
            </button>
          );

          if (!hasEvents) return DayVisual;

          return (
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div>{DayVisual}</div>
              </HoverCardTrigger>
              <HoverCardContent
                side="left"
                className="w-80 p-2 shadow-xl border-gray-200 z-50"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-900 px-1 border-b pb-1 mb-2">
                    Events on {dayDate.toLocaleDateString()}
                  </h4>
                  {dayActivities.map((act) => (
                    <ActivityCard key={act.id} activity={act} />
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        },
      }}
    />
  );
}
