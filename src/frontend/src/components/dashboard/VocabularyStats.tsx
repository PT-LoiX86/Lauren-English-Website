// src/components/dashboard/VocabularyStats.tsx
import { Bar, BarChart, XAxis, LabelList, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import type { VocabularyProgressDTO } from "@/types/dashboard-dto";
import { Brain, Clock, BookOpen } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom"; // IMPORT LINK

const chartConfig = {
  words: { label: "Words" },
};

const MASTERY_COLORS = [
  "#ef4444",
  "#f97316",
  "#ead708",
  "#38bdf8",
  "#86efac",
  "#22c55e",
];

interface Props {
  stats?: VocabularyProgressDTO;
  isLoading?: boolean;
}

export function VocabularyStats({ stats, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-xl shadow-sm" />;
  }

  // EMPTY STATE WITH CALL TO ACTION
  if (!stats || stats.totalSavedWords === 0) {
    return (
      <Card className="shadow-sm bg-gray-50/50 min-h-[380px] flex flex-col justify-center items-center p-8 text-center">
        <Brain className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          No Words Saved Yet
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-[250px]">
          Build your personal dictionary to unlock spaced-repetition flashcards
          and track your mastery.
        </p>
        <Button asChild variant="default" className="gap-2">
          <Link to="/dictionary">
            <BookOpen className="h-4 w-4" />
            Go to Dictionary
          </Link>
        </Button>
      </Card>
    );
  }

  const canReview = isPast(stats.nextReviewTime);

  return (
    <Card className="shadow-sm min-h-[380px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>Vocabulary Progress</span>
          <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
            {stats.learnedWords} / {stats.totalSavedWords} Mastered
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <ChartContainer
          config={chartConfig}
          className="min-h-[180px] w-full mb-6"
        >
          <BarChart data={stats.masteryDistribution} margin={{ top: 20 }}>
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

        <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100 mt-auto">
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
