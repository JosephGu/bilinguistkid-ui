"use client";

import {
  Typography,
  Box,
  Container,
  Button,
  Modal,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  IconButton,
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
  VideocamOff,
  Sort,
  Videocam,
  Analytics,
  SelfImprovement,
  Fullscreen,
  FullscreenExit,
  VoiceChat,
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
import Progress from "./Progress";
import LexiconReport from "./LexiconReport";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [isSort, setIsSort] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const [successAlert, setSuccessAlert] = useState(false);
  const [isAnalytics, setIsAnalytics] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [reportList, setReportList] = useState<string[] | []>([]);

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
    const fullScreenHandler = async () => {
      if (fullScreen) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch (err) {
            console.error("Exit fullscreen failed:", err);
          }
        }
      }
    };
    fullScreenHandler();
  }, [fullScreen]);

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

  useEffect(() => {
    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported");
        return;
      }
      if (cameraOn) {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = streamRef.current;
        await video.play();
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        const video = videoRef.current;
        if (video && video.srcObject) {
          (video.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
          video.srcObject = null;
        }
      }
    }
    initCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      const video = videoRef.current;
      if (video && video.srcObject) {
        const oldStream = video.srcObject as MediaStream;
        if (oldStream) {
          oldStream.getTracks().forEach((track) => track.stop());
        }
        streamRef.current = null;
        video.srcObject = null;
      }
    };
  }, [cameraOn]);

  const collectionName = selectedCollectionId
    ? lexiconCollection.find((item) => item.id === selectedCollectionId)?.title
    : "";

  const selectedCollectionType = lexiconCollection
    ? lexiconCollection.find((item) => item.id === selectedCollectionId)?.type
    : LexiconType.Chinese;

  useEffect(() => {
    setLoadingCollection(true);
    const initCollection = async () => {
      try {
        const res = await loadLexiconCollection();
        setLexiconCollection(res);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "NO_TOKEN" || err.message === "NO_EMAIL") {
            redirect("/login");
          } else {
            setShowError(true);
          }
        }
      } finally {
        setLoadingCollection(false);
      }
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
  const toggleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
  };
  const handleDelete = () => {
    toggleDialogOpen(true);
  };

  const handleClose = () => {
    toggleDialogOpen(false);
    setDeleteName("");
  };

  const handleDeleteConfirm = () => {
    if (deleteName !== collectionName) {
      alert("Please Input Corrent Book Name");
      return;
    }
    handleDeleteCollection(selectedCollectionId);
    toggleDialogOpen(false);
    setDeleteName("");
  };

  const shuffleCard = (list: string[]) => {
    const tobeShuffled = [...list];
    for (let i = tobeShuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tobeShuffled[i], tobeShuffled[j]] = [tobeShuffled[j], tobeShuffled[i]];
    }
    return tobeShuffled;
  };

  const handleStart = () => {
    if (isRunning) {
      return;
    }
    setCurrIdx(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleReportOpen = () => {
    setReportOpen(true);
  };

  const handelReportClose = () => {
    setReportList([]);
    setReportOpen(false);
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
      setReportList([...reportList, word]);
      setPinyin(pinyinResult);
    } finally {
      setIsLoadingPinyin(false);
    }
  };

  const handleManualStart = () => {
    if (selectedCollectionId === "") {
      return;
    }
    if (shuffledList.length === 0) {
      return;
    } else {
      if (!isSort) {
        setShuffledList(shuffleCard(shuffledList));
      }
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
          if (isAnalytics) {
            handleReportOpen();
          }
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
      <video
        ref={videoRef}
        autoPlay
        style={{
          position: "absolute",
          top: "10%",
          left: 0,
          width: "20%",
          height: "20%",
        }}
      ></video>
      {successAlert && (
        <Alert
          severity="success"
          sx={{ width: "500px", position: "absolute", top: "10%", left: 0 }}
        >
          Lexicon deleted!
        </Alert>
      )}
      <LoadingModal open={loadingCollection}></LoadingModal>
      <Dialog open={reportOpen} onClose={handelReportClose}>
        <DialogTitle> Lexicon Report</DialogTitle>
        <DialogContent>
          <LexiconReport helpedList={reportList} originalList={shuffledList} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handelReportClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary" }}>
            Are you sure you want to delete this book? confirm:
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Book Name"
            type="text"
            fullWidth
            variant="standard"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
          />
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            Please input <b>{collectionName}</b> to confirm deletion.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          {stage === Stage.RUNNING && (
            <Progress
              currIdx={currIdx}
              total={listSize}
              onExitTest={() => handleStop()}
            />
          )}

          {stage === Stage.SELECTED && (
            <Box className="flex flex-row justify-center items-center gap-4 w-full">
              <Box className="flex-[2]"></Box>
              <Box className="flex-[6]">
                <IconButton
                  color="primary"
                  onClick={() => setCameraOn(!cameraOn)}
                >
                  {!cameraOn ? <VideocamOff /> : <Videocam />}
                </IconButton>
                {document.fullscreenEnabled && (
                  <IconButton
                    color="primary"
                    onClick={() => setFullScreen(!fullScreen)}
                  >
                    {!fullScreen ? <Fullscreen /> : <FullscreenExit />}
                  </IconButton>
                )}
                <IconButton color="primary" onClick={() => setIsSort(!isSort)}>
                  {!isSort ? <Casino /> : <Sort />}
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => setIsAnalytics(!isAnalytics)}
                >
                  {isAnalytics ? <Analytics /> : <SelfImprovement />}
                </IconButton>
              </Box>
              <Box className="flex-[2] flex justify-end items-center gap-4">
                <IconButton onClick={handleDelete} color="primary">
                  <Delete />
                </IconButton>
                <IconButton
                  onClick={() => handleEditCollection(selectedCollectionId)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Box>
            </Box>
          )}

          {stage === Stage.UNSELECTED && !loadingCollection && (
            <Box className="flex flex-row justify-center items-center gap-4 w-full">
              <Button
                onClick={addNewCollection}
                variant="outlined"
                size="large"
                startIcon={<Add />}
              >
                Add New Collection
              </Button>
            </Box>
          )}
        </Box>
        <Box
          className="w-full flex justify-center items-center h-full flex-wrap"
          sx={{
            height: "60%",
          }}
        >
          {selectedCollectionId !== "" && !isManualRunning && !isRunning && (
            <OpenBook
              name={collectionName}
              list={shuffledList}
              id={selectedCollectionId}
              onCloseBook={() => handleBack()}
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
          {/* {stage === Stage.RUNNING && (
            <Button
              onClick={handleStop}
              variant="contained"
              size="large"
              startIcon={<Stop />}
            >
              Exit
            </Button>
          )} */}
          {/* {stage === Stage.SELECTED && (
            <Button
              onClick={handleBack}
              variant="contained"
              size="large"
              startIcon={<Flag />}
            >
              Back
            </Button>
          )} */}
          {isManualRunning && (
            <Button
              onClick={handlePrevious}
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
            >
              Last
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
                Help
              </Button>
            )}
          {isManualRunning && (
            <Button
              onClick={handleNext}
              variant="contained"
              size="large"
              startIcon={<ArrowForward />}
            >
              {currIdx === shuffledList.length - 1 ? "Finish" : "Next"}
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
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
          className="text-center flex flex-col justify-center items-center w-[300px] sm:w-[400px] md:w-[500px] lg:w-[500px]
          h-[300px] sm:!h-[400px] md:h-[500px] lg:h-[500px]"
        >
          {isLoadingPinyin ? (
            <CircularProgress />
          ) : (
            <>
              <Box>
                <Typography className="font-bold !text-[32px] sm:!text-[32px] md:!text-[48px] lg:!text-[56px]">
                  {pinyin}
                </Typography>
              </Box>
              <Box className="font-bold text-[72px] sm:text-[72px] md:text-[88px] lg:text-[96px]">
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
