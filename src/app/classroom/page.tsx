"use client";

import { useEffect, useRef, useState } from "react";

import { Peer } from "peerjs";

import {
  Dialog,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useSearchParams, redirect } from "next/navigation";
import { Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { setVoiceConfig, setVideoConfig, getMediaConfig } from "./mediaConfig";

function ClassroomPage() {
  const searchParams = useSearchParams();
  const classIdParam =
    searchParams.get("classId") || searchParams.get("hostId");
  const isHost = classIdParam === searchParams.get("hostId");

  const selfScreenRef = useRef<HTMLVideoElement>(null);
  const remote1ScreenRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);

  const [classIdToJoin, setClassIdToJoin] = useState(classIdParam || "");

  const [audioOn, setAudioOn] = useState(getMediaConfig().audio);
  const [videoOn, setVideoOn] = useState(getMediaConfig().video);

  console.log(classIdParam);

  useEffect(() => {
    setVoiceConfig(audioOn);
    setVideoConfig(videoOn);
  }, [audioOn, videoOn]);

  const launchClass = () => {
    // 获取stream
    navigator.mediaDevices
      .getUserMedia({ video: videoOn, audio: audioOn })
      .then((stream) => {
        // 在本地播放自己的视频
        if (selfScreenRef.current) {
          selfScreenRef.current.srcObject = stream;
        }

        // 呼叫远程用户
        if (peerRef.current && classIdParam && classIdParam !== "uua8") {
          // 避免呼叫自己
          const call = peerRef.current.call(classIdParam, stream);
          call.on("stream", (remoteStream) => {
            console.log("remoteStream", remoteStream);
            // 播放远程视频
            if (remote1ScreenRef.current) {
              remote1ScreenRef.current.srcObject = remoteStream;
            }
          });
        }
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };

  const handleJoinClassClick = () => {
    redirect(`/classroom/${classIdToJoin}`);
  };

  const handleLaunchClassClick = () => {
    const classIdToJoin = Math.random().toString(36).substring(2, 6);
    redirect(`/classroom/${classIdToJoin}`);
  };

  return (
    <Box className="m-8 align-items-center flex justify-center flex-col">
      <Box className="flex flex-col items-center justify-center">
        <TextField
          label="Class Code"
          variant="outlined"
          className="d-block"
          value={classIdToJoin}
          onChange={(e) => setClassIdToJoin(e.target.value)}
        ></TextField>
      </Box>
      <Box className="flex flex-row items-center justify-center">
        <IconButton onClick={() => setVideoOn(!videoOn)}>
          {videoOn ? <Videocam color="primary" /> : <VideocamOff />}
        </IconButton>
        <IconButton onClick={() => setAudioOn(!audioOn)}>
          {audioOn ? <Mic color="primary" /> : <MicOff />}
        </IconButton>
      </Box>
      <Box className="flex flex-row items-center justify-center">
        <Button onClick={handleLaunchClassClick}>Launch Class</Button>
        <Button onClick={handleJoinClassClick}>Join Class</Button>
      </Box>
    </Box>
  );
}
export default ClassroomPage;
