import { useEffect, useState } from "react";
import { Interview } from "@/types/interview";
import { InterviewService } from "@/services/interview.service";
import { formatInterviewsData } from "@/utils/format-interview";

const useInterviews = () => {
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const interviewService = new InterviewService();
      const result = await interviewService.getInterviewsByUser();
      if (!result.status) {
        throw new Error(result.message || "Error in retrieving interviews");
      }

      const formattedInterviews = formatInterviewsData(result.data || []);

      setInterviews(formattedInterviews);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return { loading, interviews, fetchInterviews };
};

export default useInterviews;
