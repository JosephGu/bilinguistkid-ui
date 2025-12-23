"use client";

import { useEffect } from "react";

import { Peer } from "peerjs";

import { Dialog, Box, Button, TextField } from "@mui/material";

function ClassroomPage() {
  const peer = new Peer();

  useEffect(() => {}, []);

  const launchClass = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = peer.call("another-peers-id", stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
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

  return (
    <Dialog open fullWidth>
      <Box className="m-8 align-items-center flex justify-center flex-col">
        <Box className="flex flex-col items-center justify-center">
          <TextField
            label="Class Code"
            variant="outlined"
            className="d-block"
          ></TextField>
        </Box>
        <Box className="flex flex-row items-center justify-center">
          <Button onClick={launchClass}>Launch Class</Button>
          <Button onClick={joinClass}>Join Class</Button>
        </Box>
      </Box>
    </Dialog>
  );
}
export default ClassroomPage;
