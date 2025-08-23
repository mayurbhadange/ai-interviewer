import {
  FeedbackItem,
  InterviewData,
  InterviewFeedback,
  InterviewSummary,
} from "@/types/interview";

/**
 * Formats raw interview data to match the InterviewData and InterviewFeedback interfaces
 * @param rawData The raw interview data from the API
 * @returns Formatted interview data and feedback
 */
export const formatInterviewsData = (rawData: any[]) => {
  const updatedData = rawData.map((interview_data: any) => {
    // Format interview data
    const interviewData: InterviewData = {
      id: interview_data.id,
      name: interview_data.name,
      type: interview_data.type,
      questions: interview_data.questions || [],
      skills: interview_data.skills || [],
      jobDescription: interview_data.job_description || "",
      createdAt: interview_data.created_at,
    };

    // Format feedback items
    const feedbackItems: FeedbackItem[] = [];
    if (
      interview_data.interview_details &&
      interview_data.interview_details.feedback
    ) {
      feedbackItems.push(
        ...interview_data.interview_details.feedback.map((item: any) => ({
          label: item.label,
          question: item.question,
          yourAnswer: item.answer,
          feedback: item.feedback,
          category: null,
          suggesstionForImprovement: item.suggesstion_for_improvement,
        }))
      );
    }

    // Format interview summary
    const summary: InterviewSummary = {
      relevantResponses:
        interview_data.interview_details?.summaries?.relevant_responses || "",
      clarityAndStructure:
        interview_data.interview_details?.summaries?.clarity_and_structure ||
        "",
      professionalLanguage:
        interview_data.interview_details?.summaries?.professional_language ||
        "",
      initialIdeas:
        interview_data.interview_details?.summaries?.initial_ideas || "",
      additionalNotableAspects:
        interview_data.interview_details?.summaries
          ?.additional_notable_aspects || "",
      score:
        interview_data.interview_details?.summaries?.score?.toString() || "0",
    };

    // Combine into complete feedback object
    const interviewFeedback: InterviewFeedback = {
      feedback: feedbackItems,
      summary: summary,
    };

    return {
      interviewData,
      interviewFeedback,
      videoLink: interview_data.interview_details?.video || "",
    };
  });

  return updatedData;
};

export const formatInterviewData = (rawData: any) => {
  // Format interview data
  const interviewData: InterviewData = {
    id: rawData.id,
    name: rawData.name,
    type: rawData.type,
    questions: rawData.questions || [],
    skills: rawData.skills || [],
    jobDescription: rawData.job_description || "",
    createdAt: rawData.created_at,
  };

  // Format feedback items
  const feedbackItems: FeedbackItem[] = [];
  if (rawData.interview_details && rawData.interview_details.feedback) {
    feedbackItems.push(
      ...rawData.interview_details.feedback.map((item: any) => ({
        label: item.label,
        question: item.question,
        yourAnswer: item.answer,
        feedback: item.feedback,
        category: null,
        suggesstionForImprovement: item.suggesstion_for_improvement,
      }))
    );
  }

  // Format interview summary
  const summary: InterviewSummary = {
    relevantResponses:
      rawData.interview_details?.summaries?.relevant_responses || "",
    clarityAndStructure:
      rawData.interview_details?.summaries?.clarity_and_structure || "",
    professionalLanguage:
      rawData.interview_details?.summaries?.professional_language || "",
    initialIdeas: rawData.interview_details?.summaries?.initial_ideas || "",
    additionalNotableAspects:
      rawData.interview_details?.summaries?.additional_notable_aspects || "",
    score: rawData.interview_details?.summaries?.score?.toString() || "0",
  };

  // Combine into complete feedback object
  const interviewFeedback: InterviewFeedback = {
    feedback: feedbackItems,
    summary: summary,
  };

  return {
    interviewData,
    interviewFeedback,
    videoLink: rawData.interview_details?.video || "",
  };
};
