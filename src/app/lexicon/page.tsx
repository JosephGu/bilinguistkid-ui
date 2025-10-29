"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

const LexiconPage = () => {
  const lexiconList = [
    "welcome",
    "door",
    "good morning",
    "good afternoon",
    "good evening",
    "chair",
    "classroom",
    "pencil case",
    "book",
    "pack",
    "desk",
    "floor",
    "Let me help you.",
    "eraser",
    "Clean your chair.",
    "My name is Shenshen.",
    "Nice to meet you, Lily.",
    "my",
    "hello",
    "evening",
    "clean",
    "I'm fine. Thank you.",
    "Clean our classroom",
    "Let me put the books back.",
    "ruler",
    "goodbye",
    "morning",
    "How are you?",
    "pencil",
    "friend",
    "afternoon",
    "Don't worry.",
    "Pack my schoolbag.",
    "name",
    "Clean our classroom.",
    "schoolbag",
    "blackboard",
    "Use my ruler.",
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currIdx, setCurrIdx] = useState(0);
  const [shuffledList, setShuffledList] = useState<string[]>(lexiconList);
  const [isRunning, setIsRunning] = useState(false);
  const listSize = shuffledList.length;
  const initialFontSize = 92;

  const isFinished = currIdx >= listSize;

  useEffect(() => {
    if (isRunning && !isFinished) {
      timeoutRef.current = setTimeout(() => {
        setCurrIdx((prevIdx) => {
          const nextIdx = prevIdx + 1;
          if (nextIdx >= listSize) {
            setIsRunning(false);
            return prevIdx;
          }
          return nextIdx;
        });
      }, 1500);
    }
    return () => {
      if (timeoutRef && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRunning, currIdx, isFinished, listSize]);

  const shuffleCard = (list: string[]) => {
    const shuffledList = [...list];
    for (let i = shuffledList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    setShuffledList(shuffledList);
  };

  const handleStart = () => {
    if (isRunning) {
      return;
    }
    setCurrIdx(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setCurrIdx(0);
  };

  const getFontSize = (word: string) => {
    const size = word.length < 12 ? "large" : word.length < 18 ? "medium" : "small";

    switch (size) {
      case "large":
        return initialFontSize;
      case "medium":
        return initialFontSize - 12;
      case "small":
        return initialFontSize - 36;
      default:
        return initialFontSize;
    }
  };

  return (
    <Container sx={{ height: "100%", width: "100%", position: "relative" }}>
      <Box className="w-full flex justify-center items-center h-full flex-col">
        <Box
          className="w-full flex justify-center items-center gap-4"
          sx={{ height: "10%" }}
        >
          {currIdx + 1} / {listSize}
        </Box>
        <Box
          className="w-full flex justify-center items-center h-full"
          sx={{ height: "60%" }}
        >
          <Typography
            sx={{ fontSize: getFontSize(shuffledList[currIdx]) }}
            color="text.secondary"
            gutterBottom
          >
            {shuffledList[currIdx]}
          </Typography>
        </Box>
        <Box
          className="w-full flex justify-center items-center gap-4"
          sx={{ height: "30%" }}
        >
          <Button onClick={handleStart} variant="contained" size="large">
            Start
          </Button>
          <Button onClick={handleStop} variant="contained" size="large">
            Stop
          </Button>
          <Button
            onClick={() => shuffleCard(lexiconList)}
            variant="contained"
            size="large"
          >
            Shuffle
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LexiconPage;
