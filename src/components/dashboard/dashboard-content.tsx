"use client";

import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user.context";
import type { Interview } from "@/types/interview";

import InterviewCard from "../interview/interview-card";
import InterviewDialog from "../interview/interview-dialog";
import InterviewDashboardSkeleton from "../interview/interview-skeleton";

// ui components
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardContentProps {
  loading: boolean;
  interviews: Interview[];
}

const DashboardContent = ({ loading, interviews }: DashboardContentProps) => {
  const router = useRouter();
  const {
    user: { name },
  } = useUser();

  // Calculate stats
  const totalInterviews = interviews.length;
  const personalInterviews = interviews.filter(
    (interview) => interview.interviewData.type === "PERSONAL"
  ).length;
  const customInterviews = interviews.filter(
    (interview) => interview.interviewData.type === "CUSTOM"
  ).length;
  const interviewsWithFeedback = interviews.filter(
    (interview) => interview.interviewFeedback.feedback.length > 0
  ).length;
  const feedbackPercentage =
    totalInterviews > 0
      ? Math.round((interviewsWithFeedback / totalInterviews) * 100)
      : 0;

  // Get most recent interview
  const mostRecentInterview =
    interviews.length > 0
      ? interviews.sort((a, b) => {
          const dateA = a.interviewData.createdAt
            ? new Date(a.interviewData.createdAt).getTime()
            : 0;
          const dateB = b.interviewData.createdAt
            ? new Date(b.interviewData.createdAt).getTime()
            : 0;
          return dateB - dateA;
        })[0]
      : null;

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return <InterviewDashboardSkeleton />;
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="text-muted-foreground">
            Manage your interviews and review your performance
          </p>
        </div>
        <InterviewDialog />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Interviews
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              {personalInterviews} personal, {customInterviews} custom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback Completion
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interviewsWithFeedback}/{totalInterviews}
            </div>
            <Progress
              value={feedbackPercentage}
              className="h-2 mt-2 bg-gray-100 [&>div]:bg-blue-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Interview
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mostRecentInterview
                ? mostRecentInterview.interviewData.type
                    .charAt(0)
                    .toUpperCase() +
                  mostRecentInterview.interviewData.type.toLowerCase().slice(1)
                : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {mostRecentInterview
                ? formatDate(mostRecentInterview.interviewData.createdAt || "")
                : "No interviews yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interviewsWithFeedback > 0
                ? (
                    interviews
                      .filter((i) => i.interviewFeedback.feedback.length > 0)
                      .reduce((acc, i) => {
                        const score = Number.parseInt(
                          i.interviewFeedback.summary.score || "0"
                        );
                        return acc + score;
                      }, 0) / interviewsWithFeedback
                  ).toFixed(1)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {interviewsWithFeedback} interviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interviews Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            All Interviews
          </TabsTrigger>
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {interviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">No interviews yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  Start by creating your first interview to practice and receive
                  feedback.
                </p>
                <InterviewDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews.slice(0, 6).map((interview, index) => (
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
          )}

          {interviews.length > 6 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/interviews")}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                View All Interviews
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          {interviews.filter((i) => i.interviewData.type === "PERSONAL")
            .length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No personal interviews
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  Personal interviews help you practice common interview
                  questions.
                </p>
                <InterviewDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews
                .filter((i) => i.interviewData.type === "PERSONAL")
                .slice(0, 6)
                .map((interview, index) => (
                  <InterviewCard
                    key={index}
                    id={interview.interviewData.id}
                    title={interview.interviewData.name}
                    date={interview.interviewData.createdAt || ""}
                    type={interview.interviewData.type}
                    isFeedback={interview.interviewFeedback.feedback.length > 0}
                  />
                ))}
            </div>
          )}

          {interviews.filter((i) => i.interviewData.type === "PERSONAL")
            .length > 6 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/interviews/personal")}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                View All Personal Interviews
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {interviews.filter((i) => i.interviewData.type === "CUSTOM")
            .length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No custom interviews
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  Custom interviews let you practice with specific skills and
                  job descriptions.
                </p>
                <InterviewDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviews
                .filter((i) => i.interviewData.type === "CUSTOM")
                .slice(0, 6)
                .map((interview, index) => (
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
          )}

          {interviews.filter((i) => i.interviewData.type === "CUSTOM").length >
            6 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/interviews/custom")}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                View All Custom Interviews
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
