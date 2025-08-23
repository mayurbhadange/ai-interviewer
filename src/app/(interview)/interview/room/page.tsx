"use client";

import { useEffect, useState } from "react";
import {
  // ControlBar,
  DisconnectButton,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  type TrackReference,
  type TrackReferenceOrPlaceholder,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useRouter, useSearchParams } from "next/navigation";
import { MonitorIcon, AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { withAuth } from "@/context/auth.context";

// Recording Indicator
const RecordingIndicator = () => (
  <div
    className="absolute top-12 left-16 bg-white/90 
  backdrop-blur-sm rounded-md px-3 py-1.5 flex items-center space-x-2 shadow-md"
  >
    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
    <span className="text-gray-800 text-sm font-medium">Recording</span>
  </div>
);

// Custom Participant Tile with Avatar Support and Joining Logic
const CustomParticipantTile = ({ trackRef }: { trackRef: TrackReference }) => {
  const isCameraOff = !trackRef?.participant?.isCameraEnabled;
  const isSpeaking = trackRef?.participant?.isSpeaking;

  return (
    <div className="relative w-full h-full rounded-lg bg-white border border-blue-500/20 p-1 shadow-md">
      {isCameraOff ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-lg">
          <div
            className={`flex items-center justify-center rounded-full p-4 ${
              isSpeaking
                ? "shadow-[0_0_30px_15px_rgba(59,130,246,0.3)] bg-white transition-all duration-300"
                : "shadow-md bg-white"
            }`}
          >
            <img
              src="/assets/brand.png"
              alt="Participant Avatar"
              className="h-24 w-24 p-4"
            />
          </div>
        </div>
      ) : (
        <ParticipantTile trackRef={trackRef} className="w-full h-full" />
      )}
    </div>
  );
};

// Layout for interviewer and interviewee
interface LayoutProps {
  tracks: TrackReferenceOrPlaceholder[];
}

const InterviewerLayout = ({ tracks: references }: LayoutProps) => {
  if (references.length === 2) {
    const interviewer = references[0];
    const interviewee = references[1];

    return (
      <div className="relative w-full h-full px-8 md:px-14 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="w-full h-full">
            <ParticipantTile trackRef={interviewer} className="w-full h-full" />
          </div>
          <div className="w-full h-full">
            <CustomParticipantTile trackRef={interviewee} />
          </div>
        </div>
      </div>
    );
  }

  // When only interviewee has joined (references.length === 1)
  if (references.length === 1) {
    const interviewee = references[0];

    return (
      <div className="relative w-full h-full px-8 md:px-14 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="w-full h-full">
            <CustomParticipantTile trackRef={interviewee} />
          </div>
          <div className="w-full h-full bg-white border border-blue-500/20 rounded-lg flex items-center justify-center shadow-md">
            <InterviewerJoiningOverlay />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-lg text-gray-800">Waiting for participants...</div>
    </div>
  );
};

// Interviewer Joining Overlay Component
const InterviewerJoiningOverlay = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30);
  const [showFailureDialog, setShowFailureDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setShowFailureDialog(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded">
          00:{timeLeft.toString().padStart(2, "0")}
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-pulse">
            <img
              src="/assets/brand.png"
              alt="AI Interviewer"
              className="h-16 w-16 opacity-70"
            />
          </div>
          <span className="text-blue-500 text-lg font-medium">
            AI-Interviewer is joining
          </span>
        </div>
      </div>

      <Dialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-start text-xl font-semibold text-gray-900">
              Connection Issue
            </DialogTitle>
            <DialogDescription className="text-start text-gray-600 text-base">
              We were unable to connect the interviewer. This may be due to
              temporary network or technical difficulties.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center space-x-4 pt-4">
            <Button
              variant="outline"
              className="px-6 py-2 text-black"
              onClick={() => setShowFailureDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600"
              onClick={() => router.push("/dashboard")}
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Room Content with Control Bar
const RoomContent = () => {
  const router = useRouter();

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <InterviewerLayout tracks={tracks} />
        </div>
        <RecordingIndicator />
      </div>

      <div className="flex justify-between items-center px-8 md:px-14 pb-6 bg-white backdrop-blur-sm border-t border-blue-500/10">
        <div className="text-sm text-gray-800 font-semibold">
          Technical Interview
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="px-4 py-2 rounded-lg border-blue-500/20 hover:bg-blue-50 text-blue-500"
          >
            <MonitorIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 rounded-lg border-blue-500/20 hover:bg-blue-50 text-blue-500"
          >
            <AlertTriangle className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 rounded-lg border-blue-500/20 hover:bg-blue-50 text-blue-500"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        <DisconnectButton
          onClick={() => router.push("/interview/complete")}
          className="!px-4 !py-2 !bg-red-500 !text-white hover:!bg-red-500/80 !rounded-lg !transition-colors flex items-center space-x-2"
        >
          Leave
        </DisconnectButton>
      </div>
    </div>
  );
};

// Main Interview Room Component
const InterviewRoom = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const url = searchParams.get("url");

  return (
    <LiveKitRoom
      token={token!}
      serverUrl={url!}
      data-lk-theme="default"
      video={true}
      audio={true}
      className="h-screen"
    >
      <RoomContent />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default withAuth(InterviewRoom);
