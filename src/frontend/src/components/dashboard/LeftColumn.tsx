import { useQuery } from "@tanstack/react-query";
import { NextPeriodCard } from "./NextPeriodCard";
import { VocabularyStats } from "./VocabularyStats";
import { AIReviewCard } from "./AIReviewCard";
import { apiClient } from "@/api/Client";
import { useAuthStore } from "@/stores/AuthStore";
import type {
  ClassPeriodDTO,
  VocabularyProgressDTO,
  TestFeedbackDTO,
} from "@/types/dashboard-dto";

export function LeftColumn() {
  const { user } = useAuthStore();

  // Fetch Class Period (Pagination format: extract content[0])
  const { data: nextPeriod, isLoading: isLoadingPeriod } = useQuery({
    queryKey: ["nextPeriod", user?.userId],
    queryFn: async () => {
      const res = await apiClient.get<{ content: ClassPeriodDTO[] }>(
        "/class-periods?size=1&sort=startAt,asc",
      );

      const period = res.data.content[0];
      if (!period) return null;

      return {
        ...period,
        startTime: new Date(period.startTime),
      } as ClassPeriodDTO;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Fetch Vocabulary Progress
  const { data: vocabStats, isLoading: isLoadingVocab } = useQuery({
    queryKey: ["vocabProgress", user?.userId],
    queryFn: async () => {
      const res = await apiClient.get<VocabularyProgressDTO>(
        "/vocabulary/progress",
      );

      if (!res.data) return null;

      return {
        ...res.data,
        nextReviewTime: new Date(res.data.nextReviewTime),
      } as VocabularyProgressDTO;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Latest AI Review
  const { data: aiReview, isLoading: isLoadingReview } = useQuery({
    queryKey: ["aiReview", user?.userId],
    queryFn: async () => {
      const res = await apiClient.get<TestFeedbackDTO | "">(
        "/test-attempts/latest-feedback",
      );

      if (!res.data || res.status === 204) return null;

      return res.data as TestFeedbackDTO;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 30, // Reviews don't change often, cache longer (30 mins)
  });

  return (
    <div className="flex flex-col gap-6 w-full flex-1">
      <NextPeriodCard
        period={nextPeriod || undefined}
        isLoading={isLoadingPeriod}
      />

      <VocabularyStats
        stats={vocabStats || undefined}
        isLoading={isLoadingVocab}
      />

      <AIReviewCard
        review={aiReview || undefined}
        isLoading={isLoadingReview}
      />
    </div>
  );
}
