"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  PlayCircleOutline,
  PauseCircleOutline,
  VolumeUp,
  VolumeOff,
  Error,
} from "@mui/icons-material";

interface AudioPlayerProps {
  audioBase64: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBase64 }) => {

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!audioBase64 || typeof audioBase64 !== "string") {
      setHasError(true);
      return;
    }

    try {
      const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
      audioSourceRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        setIsLoading(false);
        setHasError(false);
      };

      audio.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        setIsPlaying(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
      };
      

      setIsLoading(true);
      setHasError(false);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current || hasError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Failed to play audio:", error);
          setHasError(true);
          setIsPlaying(false);
        });
    }
  };


  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <Tooltip title="Loading...">
        <IconButton disabled color="primary">
          <CircularProgress size={24} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title={isPlaying ? "Pause" : "Play"}>
        <IconButton onClick={togglePlay} color="primary" size="large" disabled={hasError}>
          {isPlaying ? <PauseCircleOutline /> : <PlayCircleOutline />}
        </IconButton>
      </Tooltip>

      <Tooltip title={isMuted ? "Unmute" : "Mute"}>
        <IconButton onClick={toggleMute} color="primary" size="large" disabled={hasError}>
          {isMuted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
      </Tooltip>

    </Box>
  );
};

export default AudioPlayer;
