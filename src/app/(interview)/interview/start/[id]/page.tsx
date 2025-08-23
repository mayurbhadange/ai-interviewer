"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Camera, Mic, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import MicLevelIndicator from "@/components/interview/mic-indicator";
import { useUser } from "@/context/user.context";
import { withAuth } from "@/context/auth.context";

const InterviewSection = () => {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.id;

  const { user } = useUser();
  const [micEnabled, setMicEnabled] = useState(false);
  const [webCamEnable, setWebCamEnable] = useState(false);
  const [showMicIndicator, setShowMicIndicator] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [check, setCheck] = useState({
    first: false,
    second: false,
  });

  const allChecked = check.first && check.second;
  const readinessPercentage = (check.first ? 50 : 0) + (check.second ? 50 : 0);

  const handleEnableCamera = (checked: any) => {
    setCheck((prev) => ({ ...prev, first: checked === true }));
    setWebCamEnable(checked === true);
  };

  const handleMicPermission = async (checked: string | boolean) => {
    setCheck((prev) => ({ ...prev, second: checked === true }));

    if (checked) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicEnabled(true);
        setShowMicIndicator(true);
      } catch (err) {
        setMicEnabled(false);
        setShowMicIndicator(false);
        setError(
          "Microphone access denied. Please check your browser permissions."
        );
      }
    } else {
      setMicEnabled(false);
      setShowMicIndicator(false);
    }
  };

  const handleConnect = async () => {
    if (!allChecked) return;

    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch(
        `/api/v1/token?id=${interviewId}&authId=${user.id}`
      );
      const data = await resp.json();

      if (data.accessToken) {
        router.push(
          `/interview/room?token=${data.accessToken}&url=${data.url}`
        );
      } else {
        setError(data.error || "Failed to get access token");
      }
    } catch (err) {
      setError("An error occurred while connecting to the interview");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 my-20">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0C0C0C]">
              Be ready for your Interview
            </h1>
            <p className="text-[#656D76] mt-2 max-w-2xl">
              You&apos;ll be taking a 10 minute interview about your prior work
              experience. Relax, you&apos;ve done this before.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <Card className="overflow-hidden border-2 border-dashed border-muted">
              <CardContent className="p-0">
                {webCamEnable ? (
                  <Webcam
                    className="w-full aspect-video object-cover rounded-xl"
                    mirrored={true}
                    onUserMedia={() => setWebCamEnable(true)}
                    onUserMediaError={() => {
                      setWebCamEnable(false);
                      setCheck((prev) => ({ ...prev, first: false }));
                      setError(
                        "Camera access denied. Please check your browser permissions."
                      );
                    }}
                    videoConstraints={{
                      width: 640,
                      height: 400,
                    }}
                  />
                ) : (
                  <div className="w-full aspect-video bg-[#212125] flex flex-col items-center justify-center rounded-xl">
                    <Camera className="h-12 w-12 text-white mb-2" />
                    <p className="text-xl text-white">Camera is off</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {webCamEnable && (
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Camera is working properly</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#0C0C0C]">
                Ready to join?
              </h2>
              <p className="text-[#71717A] text-sm">
                Please ensure your devices are properly configured.
              </p>
            </div>

            <div className="space-y-4">
              <Card
                className={cn(
                  "transition-colors",
                  check.first ? "border-blue-200 bg-blue-50/50" : ""
                )}
              >
                <CardContent className="flex items-center p-4 px-3 gap-4">
                  <Camera className="text-[#161619] h-6 w-6" />

                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="text-[#0C0C0C] text-md">Enable Camera</div>
                    <div className="text-[#71717A] text-xs w-full text-start">
                      Please ensure your camera is properly configured.
                    </div>
                  </div>

                  <Checkbox
                    checked={check.first}
                    onCheckedChange={(checked) => handleEnableCamera(checked)}
                    className="bg-[#FFFFFF] border-[#656D76] data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                </CardContent>
              </Card>

              <Card
                className={cn(
                  "transition-colors",
                  check.second ? "border-blue-200 bg-blue-50/50" : ""
                )}
              >
                <CardContent className="flex items-center p-4 px-3 gap-4">
                  <Mic className="text-[#161619] h-6 w-6" />

                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="text-[#0C0C0C] text-md">
                      Enable Microphone
                    </div>
                    <div className="text-[#71717A] text-xs w-full text-start">
                      Please ensure your microphone is properly configured.
                    </div>

                    {showMicIndicator && (
                      <MicLevelIndicator
                        barCount={10}
                        activeColor="#2A50B0"
                        onLevelChange={(level) => {
                          console.log("Audio level:", level);
                        }}
                      />
                    )}
                  </div>

                  <Checkbox
                    checked={check.second}
                    onCheckedChange={(checked) => handleMicPermission(checked)}
                    className="bg-[#FFFFFF] border-[#656D76] data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                </CardContent>
              </Card>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="secondary"
                onClick={handleConnect}
                disabled={!allChecked || isLoading}
                className="text-white rounded-lg w-full bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    {allChecked
                      ? "Start Interview"
                      : `Complete Setup (${readinessPercentage}%)`}
                  </>
                )}
              </Button>

              {!allChecked && (
                <p className="text-sm text-[#71717A] text-center">
                  Please enable both camera and microphone to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(InterviewSection);
