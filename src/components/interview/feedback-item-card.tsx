import { FeedbackItem } from "@/types/interview";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackItemCardProps {
  item: FeedbackItem;
}

export function FeedbackItemCard({ item }: FeedbackItemCardProps) {
  return (
    <Card className="mt-2 border-2 border-l-blue-500">
      <CardContent className="p-4 pt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Question
          </h4>
          <p>{item.question}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Your Answer
          </h4>
          <p className="text-sm bg-blue-50 p-3 rounded-md">{item.yourAnswer}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Feedback
          </h4>
          <p className="text-sm">{item.feedback}</p>
        </div>

        {item.suggestionsForImprovement && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Suggestions for Improvement
            </h4>
            <p className="text-sm">{item.suggestionsForImprovement}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
