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

export interface ClassPeriodDTO {
  id: string;
  classroomName: string;
  lessonContent: string;
  startTime: Date;
}

export interface WordMasteryCountDTO {
  level: string;
  words: number;
}

export interface VocabularyProgressDTO {
  learnedWords: number;
  totalSavedWords: number;
  masteryDistribution: WordMasteryCountDTO[];
  nextReviewWordCount: number;
  nextReviewTime: Date;
}

export interface TestFeedbackDTO {
  testTitle: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}
