export interface Interview {
  interviewData: InterviewData;
  interviewFeedback: InterviewFeedback,
  videoLink: string;
}

export interface InterviewData {
  id?: string;
  name: string;
  type: string;
  questions?: string[];
  skills?: string[];
  jobDescription?: string;
  createdAt?: string;
}

/**
 * Represents a single feedback item for an interview question
 */
export interface FeedbackItem {
  label: string;
  question: string;
  yourAnswer: string;
  feedback: string;
  category?: string | null;
  suggestionsForImprovement?: string | null;
}

/**
 * Represents the summary of an interview performance
 */
export interface InterviewSummary {
  relevantResponses: string;
  clarityAndStructure: string;
  professionalLanguage: string;
  initialIdeas: string;
  additionalNotableAspects: string;
  score: string;
}

/**
 * Represents the complete interview feedback data
 */
export interface InterviewFeedback {
  feedback: FeedbackItem[];
  summary: InterviewSummary;
} 