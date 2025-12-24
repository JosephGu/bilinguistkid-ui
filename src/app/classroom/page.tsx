"use client";

import { useEffect, useState } from "react";

import { Peer } from "peerjs";

import { Dialog, Box, Button, TextField, Typography } from "@mui/material";
import { useSearchParams, redirect } from "next/navigation";

function ClassroomPage() {
  const peer = new Peer();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("classId");

  const [classIdToJoin, setClassIdToJoin] = useState(classIdParam || "");
  console.log(classIdParam);
  // const [classCode, setClassCode] = useState("");
  // if (classCodeParam && classCodeParam !== "") {
  //   setClassCode(classCodeParam);
  // }

  useEffect(() => {}, []);

  const launchClass = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = peer.call("another-peers-id", stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          const video = document.createElement("video");
          video.srcObject = remoteStream;
          video.play();
          document.body.appendChild(video);
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  };

  const joinClass = () => {
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.
            const video = document.createElement("video");
            video.srcObject = remoteStream;
            video.play();
            document.body.appendChild(video);
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });
  };

  const handleJoinClassClick = () => {
    redirect(`/classroom?classId=${classIdToJoin}`);
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
            <Button onClick={launchClass}>Launch Class</Button>
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
            <Box></Box>
            <Box></Box>
            <Box></Box>
            <Box></Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
export default ClassroomPage;
