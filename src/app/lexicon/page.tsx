"use client";

import {
  LinearProgress,
  Typography,
  Box,
  Container,
  Button,
  Paper,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  VolumeUp,
  Casino,
  Flag,
  Stop,
  Pause,
  Restore,
} from "@mui/icons-material";
import "./page.scss";

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
  const [isPaused, setIsPaused] = useState(false);
  const listSize = shuffledList.length;
  const initialFontSize = 92;

  const isFinished = currIdx >= listSize;

  useEffect(() => {
    if (isRunning && !isFinished) {
      const word = shuffledList[currIdx] ? shuffledList[currIdx] : "";
      const timeGap =
        word.length < 10 ? 1500 : Math.ceil(word.length / 5) * 500 + 500;
      console.log(currIdx, word, timeGap);
      timeoutRef.current = setTimeout(() => {
        setCurrIdx((prevIdx) => {
          const nextIdx = prevIdx + 1;
          if (nextIdx >= listSize) {
            setIsRunning(false);
            return prevIdx;
          }
          return nextIdx;
        });
      }, timeGap);
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
    setCurrIdx(0);
    setIsPaused(false);
  };

  const handleStart = () => {
    if (isRunning) {
      return;
    }
    setCurrIdx(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setCurrIdx(0);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleRestore = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleReadingWord = () => {
    const word = shuffledList[currIdx];
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-UK";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const getFontSize = (word: string) => {
    const size =
      word.length < 12 ? "large" : "small";
    switch (size) {
      case "large":
        return initialFontSize;
      case "small":
        return initialFontSize - 24;
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
          {(isRunning || isPaused) && (
            <Box className="w-full flex justify-center items-center gap-4">
              <Box className="flex-1"></Box>
              <Box className="flex-[8]">
                <LinearProgress
                  sx={{ width: "100%", height: 10 }}
                  variant="determinate"
                  value={((currIdx + 1) / listSize) * 100}
                />
              </Box>
              <Box className="flex-1">
                {currIdx + 1}/{listSize}
              </Box>
            </Box>
          )}
        </Box>
        <Box
          className="w-full flex justify-center items-center h-full card-container"
          sx={{ height: "60%" }}
        >
          {!isRunning && !isPaused && (
            <Paper
              className=" flex justify-center items-center p-10  flex-col w-[400px] h-[300px]"
              elevation={3}
            >
              <Box className="text-[24px] mb-5 font-bold">Default Lexicon Collection</Box>
              <Box className="flex flex-col justify-center items-center gap-2 text-sm text-[16px]">
                {shuffledList.map((word, index) => {
                  if (index < 5) {
                    return (
                      <Box key={word}>
                        {index + 1}. {word}
                      </Box>
                    );
                  } else if (index === 6) {
                    return <Box key="ellipsisNoRepeat">...</Box>;
                  } else {
                    return null;
                  }
                })}
              </Box>
            </Paper>
          )}
          <Typography
            sx={{
              fontSize: getFontSize(shuffledList[currIdx]),
              fontWeight: "bold",
            }}
            color="text.primary"
            gutterBottom
          >
            {(isRunning || isPaused) && shuffledList[currIdx]}
          </Typography>
        </Box>

        <Box
          className="w-full flex justify-center items-start gap-4"
          sx={{ height: "30%" }}
        >
          {!isRunning && !isPaused && (
            <Button
              onClick={handleStart}
              variant="contained"
              size="large"
              startIcon={<Flag />}
            >
              Start
            </Button>
          )}
          {isRunning && (
            <Button
              onClick={handleStop}
              variant="contained"
              size="large"
              startIcon={<Stop />}
            >
              Stop
            </Button>
          )}
          {isRunning && !isPaused && (
            <Button
              onClick={handlePause}
              variant="contained"
              size="large"
              startIcon={<Pause />}
            >
              Pause
            </Button>
          )}
          {isPaused && (
            <Button
              onClick={handleRestore}
              variant="contained"
              startIcon={<Restore />}
              size="large"
            >
              Restore
            </Button>
          )}
          {!isRunning && !isPaused && (
            <Button
              onClick={() => shuffleCard(lexiconList)}
              variant="contained"
              startIcon={<Casino />}
              size="large"
            >
              Shuffle
            </Button>
          )}
          {isPaused && (
            <Button
              onClick={handleReadingWord}
              size="large"
              variant="contained"
              startIcon={<VolumeUp />}
            >
              Read
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LexiconPage;
