import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TestFeedbackDTO } from "@/types/dashboard-dto";
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  review?: TestFeedbackDTO;
  isLoading?: boolean;
}

export function AIReviewCard({ review, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="h-[280px] w-full rounded-xl shadow-sm" />;
  }

  if (!review) {
    return (
      <Card className="shadow-sm bg-gray-50/50 min-h-[280px] flex flex-col justify-center items-center">
        <CardContent className="p-8 text-center text-gray-500">
          <Lightbulb className="h-8 w-8 mx-auto mb-3 text-gray-400" />
          <h3 className="font-semibold text-gray-700 mb-1">No Tests Taken</h3>
          <p className="text-sm">
            Complete your first test to unlock AI-powered insights!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span>Last Test Review</span>
          <span className="text-sm font-normal text-muted-foreground border px-2 py-0.5 rounded">
            {review.testTitle}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* The 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Strengths */}
          <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {review.strengths.map((point, idx) => (
                <li
                  key={idx}
                  className="text-sm text-green-900 flex items-start gap-2"
                >
                  <span className="text-green-500 mt-0.5">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Need Improvement (Weaknesses + Suggestions) */}
          <div className="bg-red-50/50 rounded-lg p-4 border border-red-100">
            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Need Improvement
            </h3>
            <div className="space-y-4">
              <ul className="space-y-2 border-b border-red-100 pb-3">
                {review.weaknesses.map((point, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-red-900 flex items-start gap-2"
                  >
                    <span className="text-red-500 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div>
                <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">
                  Suggestions
                </h4>
                <ul className="space-y-2">
                  {review.suggestions.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-red-800 flex items-start gap-2"
                    >
                      <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
