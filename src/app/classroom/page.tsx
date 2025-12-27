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

function ClassroomPage() {
  const searchParams = useSearchParams();
  const classIdParam =
    searchParams.get("classId") || searchParams.get("hostId");
  const isHost = classIdParam === searchParams.get("hostId");

  const selfScreenRef = useRef<HTMLVideoElement>(null);
  const remote1ScreenRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);

  const [classIdToJoin, setClassIdToJoin] = useState(classIdParam || "");

  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  console.log(classIdParam);

  useEffect(() => {
    // 初始化Peer实例
    peerRef.current = new Peer();

    if (isHost) {
      console.log("launchClass");
      launchClass();
    } else {
      joinClass();
      console.log("joinClass");
    }

    // 清理函数
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [isHost, classIdParam]);

  const launchClass = () => {
    // 获取stream
    navigator.mediaDevices
      .getUserMedia({ video: videoOn, audio: micOn })
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

  const joinClass = () => {
    if (peerRef.current) {
      peerRef.current.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: videoOn, audio: micOn })
          .then((stream) => {
            // 在本地播放自己的视频
            if (selfScreenRef.current) {
              selfScreenRef.current.srcObject = stream;
            }

            call.answer(stream); // Answer the call with an A/V stream.
            call.on("stream", (remoteStream) => {
              // 播放远程视频
              if (remote1ScreenRef.current) {
                remote1ScreenRef.current.srcObject = remoteStream;
              }
            });
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
      });
    }
  };

  const handleJoinClassClick = () => {
    redirect(`/classroom?classId=${classIdToJoin}`);
  };

  const handleLaunchClassClick = () => {
    const hostId = Math.random().toString(36).substring(2, 6);
    redirect(`/classroom?hostId=${hostId}`);
  };

  return (
    <Box>
      <Dialog open={!classIdParam || classIdParam === ""} fullWidth>
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
            <IconButton onClick={() => setMicOn(!micOn)}>
              {micOn ? <Mic color="primary" /> : <MicOff />}
            </IconButton>
          </Box>
          <Box className="flex flex-row items-center justify-center">
            <Button onClick={handleLaunchClassClick}>Launch Class</Button>
            <Button onClick={handleJoinClassClick}>Join Class</Button>
          </Box>
        </Box>
      </Dialog>
      {classIdParam && classIdParam !== "" && (
        <Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Class Code: {classIdParam}
            </Typography>
          </Box>
          <Box className="flex flex-row items-center justify-center">
            <video ref={selfScreenRef} autoPlay playsInline></video>
            <video ref={remote1ScreenRef} autoPlay playsInline></video>
          </Box>
        </Box>
      )}
    </Box>
  );
}
export default ClassroomPage;
