import React, { useEffect, useRef, useState } from "react";

interface AudioContextType extends AudioContext {
  webkitAudioContext?: typeof AudioContext;
}

interface MicLevelIndicatorProps {
  barCount?: number;
  activeColor?: string;
  inactiveColor?: string;
  smoothingTimeConstant?: number;
  className?: string;
  onLevelChange?: (level: number) => void;
}

const MicLevelIndicator: React.FC<MicLevelIndicatorProps> = ({
  barCount = 10,
  activeColor = "bg-blue-500",
  inactiveColor = "#E5E7EB",
  smoothingTimeConstant = 0.7,
  className = "",
  onLevelChange,
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const animationFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initAudio = async (): Promise<void> => {
      try {
        // Get microphone stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        streamRef.current = stream;

        // Initialize audio context
        const AudioContextCtor =
          window.AudioContext ||
          (window as unknown as AudioContextType).webkitAudioContext;
        audioContextRef.current = new AudioContextCtor();

        // Set up analyzer
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = smoothingTimeConstant;

        // Connect stream to analyzer
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);

        const updateLevel = (): void => {
          if (!analyserRef.current) return;

          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
          analyserRef.current.getByteFrequencyData(dataArray);

          // Calculate average volume
          const average =
            dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          const normalizedLevel = average / 128.0; // Normalize to 0-1

          setAudioLevel(normalizedLevel);
          onLevelChange?.(normalizedLevel);

          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    initAudio();

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [smoothingTimeConstant, onLevelChange]);

  return (
    <div className={`flex gap-1 h-4 items-center ${className}`}>
      {[...Array(barCount)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-100"
          style={{
            height: `50%`,
            backgroundColor:
              audioLevel * barCount > i ? activeColor : inactiveColor,
          }}
        />
      ))}
    </div>
  );
};

export default MicLevelIndicator;
