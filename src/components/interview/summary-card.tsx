import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  LayoutList,
  BookText,
  Lightbulb,
  ClipboardList,
} from "lucide-react";
import { InterviewSummary } from "@/types/interview";

interface SummaryCardProps {
  summary: InterviewSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const scoreValue = Number.parseInt(summary.score.replace(/\D/g, "")) || 0;

  let scoreColor = "text-red-500";
  if (scoreValue >= 80) {
    scoreColor = "text-green-500";
  } else if (scoreValue >= 60) {
    scoreColor = "text-yellow-500";
  } else if (scoreValue >= 40) {
    scoreColor = "text-orange-500";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Performance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryItem
            icon={<MessageSquare className="h-5 w-5" />}
            title="Relevant Responses"
            content={summary.relevantResponses}
          />

          <SummaryItem
            icon={<LayoutList className="h-5 w-5" />}
            title="Clarity & Structure"
            content={summary.clarityAndStructure}
          />

          <SummaryItem
            icon={<BookText className="h-5 w-5" />}
            title="Professional Language"
            content={summary.professionalLanguage}
          />

          <SummaryItem
            icon={<Lightbulb className="h-5 w-5" />}
            title="Initial Ideas"
            content={summary.initialIdeas}
          />
        </div>

        <div>
          <SummaryItem
            icon={<ClipboardList className="h-5 w-5" />}
            title="Additional Notable Aspects"
            content={summary.additionalNotableAspects}
          />
        </div>

        <div className="mt-6 pt-6 border-t flex justify-between items-center">
          <h3 className="font-semibold text-lg">Overall Score</h3>
          <span className={`text-2xl font-bold ${scoreColor}`}>
            {summary.score}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SummaryItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

function SummaryItem({ icon, title, content }: SummaryItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  );
}
