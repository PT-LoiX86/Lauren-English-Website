// src/components/dashboard/VocabularyStats.tsx
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import type { VocabularyStatsDTO } from "@/types/dashboard-dto";
import { Brain, Clock } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";

const chartConfig = {
  words: { label: "Words" },
};

const MASTERY_COLORS = [
  "#ef4444", // L1: Red
  "#f97316", // L2: Orange
  "#ead708", // L3: Yellow
  "#38bdf8", // L4: Light Blue
  "#86efac", // L5: Light Green
  "#22c55e", // L6: Green
];

export function VocabularyStats({
  stats,
}: {
  stats: VocabularyStatsDTO | null;
}) {
  if (!stats) return null;

  const canReview = isPast(stats.nextReviewTime);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>Vocabulary Progress</span>
          <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-3 py-1 rounded-full">
            <strong className="text-gray-900">{stats.learnedWords}</strong> /{" "}
            {stats.totalSavedWords} learned
          </span>
        </CardTitle>
        <CardDescription>Words by Mastery Level (1-6)</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* The Chart */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={stats.masteryDistribution} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="level"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <Bar dataKey="words" radius={[4, 4, 0, 0]}>
              {stats.masteryDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={MASTERY_COLORS[index % MASTERY_COLORS.length]}
                />
              ))}
              <LabelList
                dataKey="words"
                position="top"
                className="fill-foreground font-semibold text-xs"
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-md">
              <Brain className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900">
                Next review: {stats.nextReviewWordCount} words
              </h4>
              <p className="text-sm text-emerald-700 flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" />
                {canReview
                  ? "Ready to review now!"
                  : `Available in ${formatDistanceToNow(stats.nextReviewTime)}`}
              </p>
            </div>
          </div>
          <Button
            disabled={!canReview}
            className={canReview ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            Review Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
