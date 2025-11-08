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
  Alert,
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
  Delete,
  Edit,
} from "@mui/icons-material";
import "./page.scss";
import { lexiconCollection } from "./list";
import { getPinyin } from "@/app/actions/pinyin";
import { redirect } from "next/navigation";
import { loadLexiconCollection, deleteLexicon } from "@/app/actions/lexicon";
import LoadingModal from "@/common/LoadingModal";
import { LexiconType } from "@/generated/prisma/enums";
import OpenBook from "./OpenBook";
import BookCover from "./BookCover";

enum Stage {
  UNSELECTED = "unselected",
  SELECTED = "selected",
  RUNNING = "running",
  PAUSED = "paused",
  FINISHED = "finished",
}

type LexiconCollection = {
  title: string;
  list: string[];
  id: string;
  type: LexiconType;
};

const LexiconPage = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currIdx, setCurrIdx] = useState(0);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [shuffledList, setShuffledList] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isManualRunning, setIsManualRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pinyin, setPinyin] = useState("");
  const [isLoadingPinyin, setIsLoadingPinyin] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lexiconCollection, setLexiconCollection] = useState<
    LexiconCollection[]
  >([]);
  const [successAlert, setSuccessAlert] = useState(false);

  const getDefaultLexiconType = () => {
    for (const collection of lexiconCollection) {
      if (collection.type === LexiconType.Chinese) {
        return LexiconType.Chinese;
      }
    }
    return LexiconType.English;
  };
  // const [selectedCollectionType, setSelectedCollectionType] =
  //   useState<LexiconType>(getDefaultLexiconType());

  const listSize = shuffledList.length;
  const initialFontSize = 92;

  const isFinished = currIdx >= listSize;

  const getCurrentStage = () => {
    if (selectedCollectionId === "" && shuffledList.length === 0) {
      console.log("unselected");
      return Stage.UNSELECTED;
    } else if (
      selectedCollectionId !== "" &&
      !isRunning &&
      !isManualRunning &&
      !isPaused
    ) {
      console.log("selected");
      return Stage.SELECTED;
    } else if (isRunning || isManualRunning || isPaused) {
      console.log("running");
      return Stage.RUNNING;
    }
  };

  const stage = getCurrentStage();

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

  const collectionName = selectedCollectionId
    ? lexiconCollection.find((item) => item.id === selectedCollectionId)?.title
    : "";

  const selectedCollectionType = lexiconCollection
    ? lexiconCollection.find((item) => item.id === selectedCollectionId)?.type
    : LexiconType.Chinese;

  useEffect(() => {
    setLoadingCollection(true);
    const initCollection = async () => {
      const res = await loadLexiconCollection();
      setLexiconCollection(res);
      setLoadingCollection(false);
      console.log(res);
    };
    initCollection();
  }, []);

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

  const handleSelectCollection = (id: string) => {
    const selectedCollection = lexiconCollection.find((item) => item.id === id);
    if (selectedCollection) {
      setShuffledList(selectedCollection.list);
      setCurrIdx(0);
      setIsRunning(false);
      setIsPaused(false);
      setSelectedCollectionId(id);
      // setSelectedCollectionType(selectedCollection.type);
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
    if (selectedCollectionId === "") {
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
    console.log("word: ", word);
    if (!word) {
      return initialFontSize;
    }
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

  const handleDeleteCollection = async (id: string) => {
    try {
      await deleteLexicon(id);
      setLexiconCollection(lexiconCollection.filter((item) => item.id !== id));
      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
        handleBack();
      }, 2000);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleEditCollection = (id: string) => {
    redirect(`/lexiconEdit?id=${id}`);
  };

  const handleBack = () => {
    setSelectedCollectionId("");
    setShuffledList([]);
    setCurrIdx(0);
    setIsRunning(false);
    setIsPaused(false);
    setSelectedCollectionId("");
  };

  return (
    <Container sx={{ height: "100%", width: "100%", position: "relative" }}>
      {successAlert && (
        <Alert
          severity="success"
          sx={{ width: "500px", position: "absolute", top: 0, left: 0 }}
        >
          Lexicon deleted!
        </Alert>
      )}
      <LoadingModal open={loadingCollection}></LoadingModal>
      {showError && (
        <Alert
          severity="error"
          sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        >
          Server Error, please try again later.
        </Alert>
      )}
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
          className="w-full flex justify-center items-center h-full "
          sx={{ height: "60%" }}
        >
          {selectedCollectionId !== "" && !isManualRunning && !isRunning && (
            <OpenBook
              name={collectionName}
              list={shuffledList}
              id={selectedCollectionId}
              onDelete={(id) => handleDeleteCollection(id)}
              onEdit={(id) => {
                handleEditCollection(id);
              }}
            />
          )}
          {stage === Stage.UNSELECTED &&
            lexiconCollection.map((item: LexiconCollection) => (
              <BookCover
                name={item.title}
                id={item.id}
                onClick={(id) => handleSelectCollection(id)}
                key={item.id}
              />
            ))}
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
          {stage === Stage.SELECTED && (
            <Button
              onClick={handleManualStart}
              variant="contained"
              size="large"
              startIcon={<Flag />}
            >
              Start
            </Button>
          )}
          {stage === Stage.RUNNING && (
            <Button
              onClick={handleStop}
              variant="contained"
              size="large"
              startIcon={<Stop />}
            >
              Stop
            </Button>
          )}
          {stage === Stage.SELECTED && (
            <Button
              onClick={handleBack}
              variant="contained"
              size="large"
              startIcon={<Flag />}
            >
              Back
            </Button>
          )}
          {stage === Stage.UNSELECTED && (
            <Button
              onClick={addNewCollection}
              variant="contained"
              size="large"
              startIcon={<Add />}
            >
              Add New Collection
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
          {stage === Stage.SELECTED && (
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
                <Typography className="font-bold" sx={{ fontSize: 56 }}>
                  {pinyin}
                </Typography>
              </Box>
              <Box className="font-bold" sx={{ fontSize: 96 }}>
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
