"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import useInterviewDetails from "@/hooks/use-interview-details";
import { InterviewFeedbackSkeleton } from "@/components/interview/skeleton-loading";
import { InterviewFeedbackDetails } from "@/components/interview/interview-feedback-details";
import { withAuth } from "@/context/auth.context";

const InterviewFeedbackPage = () => {
  const params = useParams();
  const interviewId = params.id;

  const { interview } = useInterviewDetails(interviewId);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Interview Feedback</h1>
      {interview?.interviewFeedback && (
        <Suspense fallback={<InterviewFeedbackSkeleton />}>
          <InterviewFeedbackDetails feedback={interview.interviewFeedback} />
        </Suspense>
      )}
    </div>
  );
};

export default withAuth(InterviewFeedbackPage);
