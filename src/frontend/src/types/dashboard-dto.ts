export type ActivityType = "PERIOD" | "TEST" | "REVIEW";

export interface ActivityDTO {
  id: string;
  type: ActivityType;
  title: string;
  classroomName?: string;
  referenceId?: string;
  description?: string;
  timestamp: Date;
}

export interface NextPeriodDTO {
  id: string;
  classroomName: string;
  periodNumber: number;
  lessonContent: string;
  startTime: Date;
}

export interface VocabularyStatsDTO {
  learnedWords: number;
  totalSavedWords: number;
  masteryDistribution: { level: string; words: number }[];
  nextReviewWordCount: number;
  nextReviewTime: Date;
}

export interface AIReviewDTO {
  testTitle: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}
