"use client";

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { LexiconType } from "@/generated/prisma/enums";
import {
  createLexicon,
  loadLexicon,
  updateLexicon,
} from "@/app/actions/lexicon";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";

const LexiconEdit = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LexiconType>(
    LexiconType.English
  );
  const [newLexicon, setNewLexicon] = useState("");
  const [lexiconList, setLexiconList] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState("");
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
      setLexiconList([...lexiconList, toBeAdded]);
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
        redirect("/lexicon");
      }
    } else {
      // create lexicon    createLexicon(formData);
      const res = await createLexicon(formData);
      if (res?.success) {
        redirect("/lexicon");
      }
    }
  };

  return (
    <Box className="flex flex-col justify-center align-center p-10">
      <Box className="flex flex-row justify-center align-center p-10">
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Create a new lexicon
        </Typography>
      </Box>
      <Box
        className="flex flex-col justify-center items-center text-left"
        gap={2}
      >
        <Box className="flex flex-row justify-center items-center w-[500px]">
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
              control={<Radio />}
            />
            <FormControlLabel
              value={LexiconType.Chinese}
              label="Chinese"
              control={<Radio />}
            />
          </RadioGroup>
        </Box>
        <Box className="flex flex-col justify-center items-center w-[500px]">
          <TextField
            placeholder="Enter collection name"
            className="w-full"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </Box>

        <Box className="flex flex-row justify-center items-center gap-2 w-[500px]">
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
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Lexicon List
          </Typography>
          <Box className="flex flex-row justify-left align-center flex-wrap">
            {lexiconList.map((item, index) => (
              <Box
                key={item}
                className="w-300px"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    width: "240px",
                    textAlign: "left",
                    fontSize: "24px",
                  }}
                  className="text-center"
                >
                  {index + 1}. {item}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => removeLexicon(index)}
                  size="large"
                  startIcon={<DeleteOutlined />}
                ></Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box className="text-center mt-5">
        <Button
          variant="contained"
          onClick={() => handleLexiconSubmit()}
          className="mr-10"
        >
          {editMode ? "Update" : "Create"}
        </Button>
        <Button variant="text" onClick={() => redirect("/lexicon")}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default LexiconEdit;
