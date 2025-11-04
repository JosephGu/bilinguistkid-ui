"use client";

import {
  LinearProgress,
  Typography,
  Box,
  Container,
  Button,
  Paper,
  Modal,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  VolumeUp,
  Casino,
  Flag,
  Stop,
  Pause,
  Restore,
  ArrowBack,
  ArrowForward,
  ClosedCaption,
  Add,
} from "@mui/icons-material";
import "./page.scss";
import { LexiconType, lexiconCollection } from "./list";
import { getPinyin } from "@/app/actions/pinyin";
import { redirect } from "next/navigation";

type LexiconCollection = {
  title: string;
  list: string[];
  id: number;
  type: LexiconType;
};

const LexiconPage = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currIdx, setCurrIdx] = useState(0);
  const [shuffledList, setShuffledList] = useState<string[]>(
    lexiconCollection[0].list
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isManualRunning, setIsManualRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [pinyin, setPinyin] = useState("");
  const [isLoadingPinyin, setIsLoadingPinyin] = useState(false);

  const getDefaultLexiconType = () => {
    for (const collection of lexiconCollection) {
      if (collection.type === LexiconType.Chinese) {
        return LexiconType.Chinese;
      }
    }
    return LexiconType.English;
  };
  const [selectedCollectionType, setSelectedCollectionType] =
    useState<LexiconType>(getDefaultLexiconType());

  const listSize = shuffledList.length;
  const initialFontSize = 92;

  const isFinished = currIdx >= listSize;

  useEffect(() => {
    if (isRunning && !isFinished) {
      const word = shuffledList[currIdx] ? shuffledList[currIdx] : "";
      const timeGap =
        word.length < 10 ? 1500 : Math.ceil(word.length / 5) * 500 + 600;
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

  useEffect(() => {
    if (isManualRunning) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isManualRunning, currIdx]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ArrowRight") {
      if (isManualRunning) {
        handleNext();
      }
    } else if (e.code === "ArrowLeft") {
      if (isManualRunning) {
        handlePrevious();
      }
    }
  };

  const shuffleCard = (list: string[]) => {
    const tobeShuffled = [...list];
    for (let i = tobeShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tobeShuffled[i], tobeShuffled[j]] = [tobeShuffled[j], tobeShuffled[i]];
    }
    setShuffledList(tobeShuffled);
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
    setIsManualRunning(false);
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

  const addNewCollection = () => {
    // setSelectedCollectionId(-1);
    // setSelectedCollectionType(getDefaultLexiconType());
    // setModalOpen(true);
    redirect("/lexiconEdit");
  };

  const handleSelectCollection = (id: number) => {
    const selectedCollection = lexiconCollection.find((item) => item.id === id);
    if (selectedCollection) {
      setShuffledList(selectedCollection.list);
      setCurrIdx(0);
      setIsRunning(false);
      setIsPaused(false);
      setSelectedCollectionId(id);
      setSelectedCollectionType(selectedCollection.type);
    }
  };

  const handleReadingWord = (type: LexiconType) => {
    const word = shuffledList[currIdx];
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang =
      selectedCollectionType === LexiconType.Chinese ? "zh-CN" : "en-UK";
    utterance.rate = 0.8;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleGetPinyin = async () => {
    setModalOpen(true);
    setIsLoadingPinyin(true);
    try {
      const word = shuffledList[currIdx];
      if (!word) {
        return;
      }
      const pinyinResult = await getPinyin(word);
      setPinyin(pinyinResult);
    } finally {
      setIsLoadingPinyin(false);
    }
  };

  const handleManualStart = () => {
    if (selectedCollectionId === -1) {
      return;
    }
    setIsManualRunning(true);
    setCurrIdx(0);
  };

  const handleNext = () => {
    if (isManualRunning && !isFinished) {
      setCurrIdx((prevIdx) => {
        const nextIdx = prevIdx + 1;
        if (nextIdx >= listSize) {
          setIsManualRunning(false);
          return prevIdx;
        }
        return nextIdx;
      });
    }
  };

  const handlePrevious = () => {
    if (isManualRunning && currIdx > 0) {
      setCurrIdx((prevIdx) => prevIdx - 1);
    }
  };

  const getFontSize = (word: string) => {
    const size = word.length < 12 ? "large" : "small";
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
          {(isRunning || isPaused || isManualRunning) && (
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
          {!isRunning &&
            !isPaused &&
            !isManualRunning &&
            lexiconCollection.map((item: LexiconCollection) => (
              <Paper
                key={item.title}
                className=" flex justify-center items-center p-10  flex-col w-[400px] h-[300px] m-10 cursor-pointer"
                elevation={3}
                onClick={() => handleSelectCollection(item.id)}
                sx={{
                  outline:
                    item.id === selectedCollectionId
                      ? "2px solid lightblue"
                      : "transparent",
                }}
              >
                <Box className="text-[24px] mb-5 font-bold">{item.title}</Box>
                <Box
                  className="flex flex-col justify-center items-center gap-2 text-sm text-[16px]"
                  sx={{
                    display: selectedCollectionId === item.id ? "flex" : "none",
                  }}
                >
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
            ))}
          {!isRunning && !isPaused && !isManualRunning && (
            <Paper
              key={-1}
              className=" flex justify-center items-center p-10  flex-col w-[400px] h-[300px] m-10 cursor-pointer"
              elevation={3}
              onClick={() => addNewCollection()}
              sx={{
                outline:
                  -1 === selectedCollectionId
                    ? "2px solid lightblue"
                    : "transparent",
              }}
            >
              <Add sx={{ fontSize: 48 }} />
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
            {(isRunning || isPaused || isManualRunning) &&
              shuffledList[currIdx]}
          </Typography>
        </Box>

        <Box
          className="w-full flex justify-center items-start gap-4"
          sx={{ height: "30%" }}
        >
          {!isRunning && !isPaused && !isManualRunning && (
            <Button
              onClick={handleStart}
              variant="contained"
              size="large"
              startIcon={<Flag />}
            >
              Start
            </Button>
          )}
          {!isRunning && !isPaused && !isManualRunning && (
            <Button
              onClick={handleManualStart}
              variant="contained"
              size="large"
              startIcon={<Flag />}
            >
              Manual
            </Button>
          )}
          {(isRunning || isManualRunning) && (
            <Button
              onClick={handleStop}
              variant="contained"
              size="large"
              startIcon={<Stop />}
            >
              Stop
            </Button>
          )}

          {isManualRunning && (
            <Button
              onClick={handlePrevious}
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
            >
              {" "}
              Last
            </Button>
          )}
          {isManualRunning && (
            <Button
              onClick={handleNext}
              variant="contained"
              size="large"
              startIcon={<ArrowForward />}
            >
              Next
            </Button>
          )}
          {isRunning && !isPaused && !isManualRunning && (
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
          {!isRunning && !isPaused && !isManualRunning && (
            <Button
              onClick={() => shuffleCard(shuffledList)}
              variant="contained"
              startIcon={<Casino />}
              size="large"
            >
              Shuffle
            </Button>
          )}
          {isManualRunning &&
            selectedCollectionType === LexiconType.English && (
              <Button
                onClick={() => handleReadingWord(selectedCollectionType)}
                size="large"
                variant="contained"
                startIcon={<VolumeUp />}
              >
                Read
              </Button>
            )}
          {isManualRunning &&
            selectedCollectionType === LexiconType.Chinese && (
              <Button
                onClick={() => handleGetPinyin()}
                size="large"
                variant="contained"
                startIcon={<ClosedCaption />}
              >
                Pinyin
              </Button>
            )}
        </Box>
      </Box>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPinyin("");
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            height: 400,
          }}
          className="text-center flex flex-col justify-center items-center"
        >
          {isLoadingPinyin ? (
            <CircularProgress />
          ) : (
            <>
              <Box>
                <Typography className="font-bold" sx={{fontSize: 56}}>
                  {pinyin}
                </Typography>
              </Box>
              <Box className="font-bold" sx={{fontSize: 96}}>
                {shuffledList[currIdx]}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default LexiconPage;
