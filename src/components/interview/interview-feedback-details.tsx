"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackItemCard } from "@/components/interview/feedback-item-card";
import { SummaryCard } from "@/components/interview/summary-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { InterviewFeedback } from "@/types/interview";

interface InterviewFeedbackDetailsProps {
  feedback: InterviewFeedback;
}

export function InterviewFeedbackDetails({
  feedback,
}: InterviewFeedbackDetailsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  // Calculate score as a percentage
  const scorePercentage =
    Number.parseInt(feedback.summary.score.replace(/\D/g, "")) || 0;

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Performance Overview</h2>
          <p className="text-muted-foreground">
            Detailed feedback from your recent interview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <span className="text-2xl font-bold">{feedback.summary.score}</span>
          </div>
          <div className="w-32">
            <Progress value={scorePercentage} className="h-2" />
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              All Feedback ({feedback.feedback.length})
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Summary
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {feedback.feedback.map((item, index) => (
            <div key={index} className="mb-4">
              <div
                className={`flex items-center justify-between cursor-pointer p-4 bg-card rounded-lg border shadow-sm ${
                  expandedItems[index] ? "border-blue-500" : ""
                }`}
                onClick={() => toggleItem(index)}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`font-medium text-xs rounded-xl px-2 py-1 ${
                        item.label === "GOOD"
                          ? "bg-yellow-50 border border-yellow-300 text-yellow-500"
                          : "bg-blue-50 border border-blue-300 text-blue-500"
                      }`}
                    >
                      {item.label === "GOOD" ? "Good" : "Needs Improvement"}
                    </Badge>
                    {item.category && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {item.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.question}
                  </p>
                </div>
                {expandedItems[index] ? (
                  <ChevronUp className="h-5 w-5 text-blue-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {expandedItems[index] && <FeedbackItemCard item={item} />}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="summary">
          <SummaryCard summary={feedback.summary} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
