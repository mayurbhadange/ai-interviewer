"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface InterviewCardProps {
  id?: string;
  title: string;
  date: string;
  type: string;
  tags?: string[];
  isFeedback: boolean;
}

const InterviewCard = ({
  id,
  title,
  date,
  type,
  tags = [],
  isFeedback,
}: InterviewCardProps) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    return type === "PERSONAL"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-purple-100 text-purple-700 border-purple-200";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`${getTypeColor(type)} border-0`}>
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </Badge>
          {isFeedback && (
            <div className="flex items-center text-blue-600 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Feedback Available
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {title}
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(date)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-blue-50 border border-blue-100"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {isFeedback ? <Button
          variant="outline"
          size="sm"
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          onClick={() => router.push(`/interview/details/${id}`)}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Details
        </Button> : <Button
          variant="outline"
          size="sm"
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          onClick={() => router.push(`/interview/start/${id}`)}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Start Interview
        </Button>}
        {/* <Button
          variant="default"
          size="sm"
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => router.push(`/interviews/${id}/video`)}
        >
          <Video className="h-3 w-3 mr-1" />
          Watch
        </Button> */}
      </CardFooter>
    </Card>
  );
};

export default InterviewCard;
