"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { ConfettiExplosion } from "@/components/magicui/confetti-explosion";
import { toast } from "sonner";

export default function InterviewCompletePage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call to submit feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Feedback submitted successfully!");

    // Navigate to dashboard after submission
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiExplosion />}

      <div className="container mx-auto py-8 px-4 flex-1 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">Interview Completed!</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Your responses have been recorded. We&apos;d love to hear your thoughts
              about the interview process.
            </p>

            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                How was your interview experience?
              </label>
              <Textarea
                id="feedback"
                placeholder="Please share your feedback about the interview process..."
                className="min-h-[120px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback & Continue"}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Skip & Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
