import { NextPeriodCard } from "./NextPeriodCard";
import { VocabularyStats } from "./VocabularyStats";
import { AIReviewCard } from "./AIReviewCard";
import type {
  NextPeriodDTO,
  VocabularyStatsDTO,
  AIReviewDTO,
} from "@/types/dashboard-dto";

// MOCK DATA
const mockNextPeriod: NextPeriodDTO = {
  id: "class-123",
  classroomName: "Advanced English 101",
  periodNumber: 12,
  lessonContent: "Complex Prepositions & Phrasal Verbs",
  startTime: new Date(Date.now() + 1000 * 60 * 60 * 2.5),
};

const mockVocabStats: VocabularyStatsDTO = {
  learnedWords: 342,
  totalSavedWords: 500,
  masteryDistribution: [
    { level: "L1", words: 80 },
    { level: "L2", words: 120 },
    { level: "L3", words: 65 },
    { level: "L4", words: 45 },
    { level: "L5", words: 20 },
    { level: "L6", words: 12 },
  ],
  nextReviewWordCount: 45,
  nextReviewTime: new Date(Date.now() - 1000 * 60),
};

const mockAIReview: AIReviewDTO = {
  testTitle: "Midterm Reading Comprehension",
  strengths: [
    "Excellent grasp of main ideas in complex academic texts.",
    "Strong vocabulary deduction from context clues.",
  ],
  weaknesses: [
    "Struggles with 'inference' questions regarding author tone.",
    "Slow reading speed causing time management issues.",
  ],
  suggestions: [
    "Practice skimming specifically for transition words (however, moreover).",
    "Read 1 academic article daily under a strict 5-minute timer.",
  ],
};

export function LeftColumn() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Next Period Hero Card */}
      <NextPeriodCard period={mockNextPeriod} />

      {/* Vocabulary Learning Stats */}
      <VocabularyStats stats={mockVocabStats} />

      {/* Last Test AI Reviews */}
      <AIReviewCard review={mockAIReview} />
    </div>
  );
}
