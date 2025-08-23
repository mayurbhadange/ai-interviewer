import { useEffect, useState } from "react";
import { Interview } from "@/types/interview";
import { InterviewService } from "@/services/interview.service";
import { formatInterviewData } from "@/utils/format-interview";

const useInterviewDetails = (interviewId: string | string[]) => {
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState<Interview>();

  const fetchInterview = async () => {
    setLoading(true);
    try {
      const interviewService = new InterviewService();
      const result = await interviewService.getInterviewById(interviewId || []);
      if (!result.status) {
        throw new Error(result.message || "Error in retrieving interviews");
      }

      const formattedInterviews = formatInterviewData(result.data);

      setInterview(formattedInterviews);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
  }, []);

  return { loading, interview, fetchInterview };
};

export default useInterviewDetails;
