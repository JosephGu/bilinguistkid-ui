"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, Suspense } from "react";
import { LexiconType } from "@/generated/prisma/enums";
import {
  createLexicon,
  loadLexicon,
  updateLexicon,
} from "@/app/actions/lexicon";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingModel from "@/common/LoadingModal";

const LexiconEditComp = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LexiconType>(
    LexiconType.English
  );
  const [newLexicon, setNewLexicon] = useState("");
  const [lexiconList, setLexiconList] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [failedAlert, setFailedAlert] = useState(false);
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id") !== null;

  useEffect(() => {
    if (editMode) {
      // fetch lexicon details
      const getLexicon = async () => {
        const lexicon = await loadLexicon(searchParams.get("id") as string);
        setCollectionName(lexicon.title);
        setSelectedLanguage(lexicon.type);
        setLexiconList(lexicon.list);
      };
      getLexicon();
    }
  }, []);

  const addNewWord = () => {
    const toBeAdded = newLexicon.trim();
    if (toBeAdded === "") {
      return;
    }
    if (lexiconList.includes(toBeAdded)) {
      return;
    }
    if (toBeAdded.startsWith("[") && toBeAdded.endsWith("]")) {
      try {
        const toBeAddedList = toBeAdded.replace(/,\s*]/g, "]");
        console.log("toBeAdded", toBeAdded);

        setLexiconList([...lexiconList, ...JSON.parse(toBeAddedList)]);
      } catch (e) {
        console.error("Invalid JSON format", e);
      }
    } else {
      setLexiconList([toBeAdded, ...lexiconList]);
    }
    setNewLexicon("");
  };
  const removeLexicon = (index: number) => {
    setLexiconList(lexiconList.filter((_, i) => i !== index));
  };

  const handleLexiconSubmit = async () => {
    if (lexiconList.length === 0) {
      return;
    }
    const formData = new FormData();
    formData.append("type", selectedLanguage);
    formData.append("title", collectionName);
    formData.append("list", JSON.stringify(lexiconList));
    if (editMode) {
      // update lexicon
      const res = await updateLexicon(
        searchParams.get("id") as string,
        formData
      );
      if (res?.success) {
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
          redirect("/lexicon");
        }, 2000);
      }
    } else {
      // create lexicon    createLexicon(formData);
      const res = await createLexicon(formData);
      if (res?.success) {
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
          redirect("/lexicon");
        }, 2000);
      }
    }
  };

  return (
    <Box className="flex flex-col justify-center align-center p-10">
      {successAlert && (
        <Alert severity="success" sx={{ width: "500px", position: "absolute", top: 0, left: 0 }}>
          Lexicon {editMode ? "updated" : "created"} successfully!
        </Alert>
      )}
      <Box className="flex flex-row justify-center align-center p-10">
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Create a new lexicon
        </Typography>
      </Box>
      <Box
        className="flex flex-col justify-center items-center text-left"
        gap={2}
      >
        <Box className="flex flex-row justify-center items-center sm:w-[300px] md:w-[500px] lg:w-[500px]">
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", marginRight: 2 }}
          >
            Select Language
          </Typography>
          <RadioGroup
            row
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as LexiconType)}
          >
            <FormControlLabel
              value={LexiconType.English}
              label="English"
              control={<Radio disabled={editMode} />}
            />
            <FormControlLabel
              value={LexiconType.Chinese}
              label="Chinese"
              control={<Radio disabled={editMode} />}
            />
          </RadioGroup>
        </Box>
        <Box className="flex flex-col justify-center items-center sm:w-[300px] md:w-[500px] lg:w-[500px]">
          <TextField
            placeholder="Enter collection name"
            className="w-full"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </Box>

        <Box className="flex flex-row justify-center items-center gap-2 sm:w-[300px] md:w-[500px] lg:w-[500px]">
          <TextField
            placeholder="Enter lexicon"
            value={newLexicon}
            onChange={(e) => setNewLexicon(e.target.value)}
            className="w-full"
          />
          <Button
            variant="contained"
            onClick={() => addNewWord()}
            disabled={newLexicon === ""}
            size="large"
          >
            Add
          </Button>
        </Box>
        <Box className="flex flex-col justify-center align-center">
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center",marginBottom: 2 }}
          >
            Lexicon List
          </Typography>
          <Box className="flex flex-row justify-left align-center flex-wrap">
            <Stack
              direction="row"
              alignItems="center"
              gap={2}
              maxWidth={1200}
              flexWrap="wrap"
              useFlexGap
            >
              {lexiconList.map((item, index) => (
                <Chip
                  label={item}
                  key={item}
                  color="primary"
                  onDelete={() => removeLexicon(index)}
                  className="mr-2"
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
        className="mt-5"
      >
        <Button
          variant="contained"
          onClick={() => handleLexiconSubmit()}
          className="mr-10"
        >
          {editMode ? "Update" : "Create"}
        </Button>
        <Button variant="outlined" onClick={() => redirect("/lexicon")}>
          Back
        </Button>
      </Stack>
    </Box>
  );
};

const LexiconEdit = () => {
  return (
    <Suspense fallback={<LoadingModel open={true} />}>
      <LexiconEditComp />
    </Suspense>
  );
};

export default LexiconEdit;
