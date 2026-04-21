import { LeftColumn } from "@/components/dashboard/LeftColumn";
import { RightColumn } from "@/components/dashboard/RightColumn";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-6">
      <LeftColumn />

      <RightColumn />
    </div>
  );
}
