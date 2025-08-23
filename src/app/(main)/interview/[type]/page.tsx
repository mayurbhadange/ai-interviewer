"use client";

import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// ui component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import useInterviewsType from "@/hooks/use-interview-type";
import InterviewCard from "@/components/interview/interview-card";
import InterviewDialog from "@/components/interview/interview-dialog";
import { withAuth } from "@/context/auth.context";

const InterviewsPage = () => {
  const params = useParams();
  const router = useRouter();
  const type = params?.type as string;
  const [searchQuery, setSearchQuery] = useState("");

  const { loading, interviews } = useInterviewsType(
    type?.toLocaleString().toUpperCase()
  );

  // Check if the type is valid
  if (typeof type !== "string") {
    return <p className="text-center text-gray-500">Invalid interview type</p>;
  }

  // Filter interviews based on search query
  const filteredInterviews = interviews.filter((interview) =>
    interview.interviewData.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Format type for display
  const formattedType =
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight capitalize">
            {formattedType} Interviews
          </h1>
          <p className="text-muted-foreground">
            {formattedType === "Personal"
              ? "Practice with common interview questions"
              : "Practice with custom skills and job descriptions"}
          </p>
        </div>
        <InterviewDialog />
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md w-full md:w-auto">
          <FileText className="h-4 w-4" />
          <span className="text-sm font-medium">
            {filteredInterviews.length} {formattedType}{" "}
            {filteredInterviews.length === 1 ? "Interview" : "Interviews"}
          </span>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search interviews..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <div className="flex gap-1 mb-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInterviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInterviews.map((interview, index) => (
            <InterviewCard
              key={index}
              id={interview.interviewData.id}
              title={interview.interviewData.name}
              date={interview.interviewData.createdAt || ""}
              type={interview.interviewData.type}
              tags={interview.interviewData.skills || []}
              isFeedback={interview.interviewFeedback.feedback.length > 0}
            />
          ))}
        </div>
      ) : (
        <Card className="my-12">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              No {formattedType} Interviews
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              {formattedType === "Personal"
                ? "Create your first personal interview to practice common interview questions."
                : "Create your first custom interview with specific skills and job descriptions."}
            </p>
            <InterviewDialog />
          </CardContent>
        </Card>
      )}

      {/* Back button */}
      {filteredInterviews.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default withAuth(InterviewsPage);
