export function parseInterviewFeedback(feedbacks: string[]) {
    const feedback_result: any[] = [];
    let feedback_object: any | null = null;
    let performance_summary: any | null = null;

    feedbacks.forEach((feedback: string) => {
      const relevantResponsesMatch = feedback.match(
        /Relevant Responses: (.+)/
      );
      const clarityMatch = feedback.match(/Clarity and Structure: (.+)/);
      const languageMatch = feedback.match(/Professional Language: (.+)/);
      const ideasMatch = feedback.match(/Initial Ideas: (.+)/);
      const aspectsMatch = feedback.match(/Additional Notable Aspects: (.+)/);
      const scoreMatch = feedback.match(/Score: (.+)/);

      if (
        relevantResponsesMatch ||
        clarityMatch ||
        languageMatch ||
        ideasMatch ||
        aspectsMatch ||
        scoreMatch
      ) {
        if (!performance_summary) {
          performance_summary = {
            relevantResponses: "",
            clarityAndStructure: "",
            professionalLanguage: "",
            initialIdeas: "",
            additionalNotableAspects: "",
            score: "",
          };
        }

        if (relevantResponsesMatch)
          performance_summary.relevantResponses =
            relevantResponsesMatch[1].trim();
        if (clarityMatch)
          performance_summary.clarityAndStructure = clarityMatch[1].trim();
        if (languageMatch)
          performance_summary.professionalLanguage = languageMatch[1].trim();
        if (ideasMatch)
          performance_summary.initialIdeas = ideasMatch[1].trim();
        if (aspectsMatch)
          performance_summary.additionalNotableAspects =
            aspectsMatch[1].trim();
        if (scoreMatch) performance_summary.score = scoreMatch[1].trim();

        return;
      }

      // Process detailed feedback
      const labelMatch = feedback.match(/Label: (.+)/);
      const questionMatch = feedback.match(/Question: (.+)/);
      const yourAnswerMatch = feedback.match(/Your Answer: (.+)/);
      const feedbackMatch = feedback.match(/Feedback: (.+)/);
      const categoryMatch = feedback.match(/Category: (.+)/);
      const suggestionsMatch = feedback.match(
        /Suggestions for improvement: (.+)/
      );

      if (labelMatch) {
        if (feedback_object) {
          feedback_result.push(feedback_object);
        }

        feedback_object = {
          label: labelMatch[1].trim(),
          question: questionMatch ? questionMatch[1].trim() : "",
          yourAnswer: yourAnswerMatch ? yourAnswerMatch[1].trim() : "",
          feedback: feedbackMatch ? feedbackMatch[1].trim() : "",
          category: categoryMatch ? categoryMatch[1].trim() : null,
          suggestionsForImprovement: suggestionsMatch
            ? suggestionsMatch[1].trim()
            : null,
        };
      } else if (feedback_object) {
        if (categoryMatch) feedback_object.category = categoryMatch[1].trim();
        if (suggestionsMatch)
          feedback_object.suggestionsForImprovement =
            suggestionsMatch[1].trim();
      }
    });

    // Push the last feedback object if it exists
    if (feedback_object) {
      feedback_result.push(feedback_object);
    }

    return {
      feedback: feedback_result,
      summary: performance_summary,
    };
  }