"use client";

import {
  Box,
  Button,
  FormControlLabel,
  Input,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useState } from "react";
import { LexiconType } from "../lexicon/list";

const LexiconEdit = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(LexiconType.English);
  const createNewLexicon = () => {};
  const [newLexicon, setNewLexicon] = useState("");
  const [lexiconList, setLexiconList] = useState<string[]>([]);
  const addNexWord = () => {
    if (newLexicon === "") {
      return;
    }
    if (lexiconList.includes(newLexicon)) {
      return;
    }
    setLexiconList([...lexiconList, newLexicon]);
    setNewLexicon("");
  };
  const removeLexicon = (index: number) => {
    setLexiconList(lexiconList.filter((_, i) => i !== index));
  };

  return (
    <Box className="flex flex-col justify-center align-center p-10">
      <Box className="flex flex-row justify-center align-center p-10">
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Create a new lexicon
        </Typography>
      </Box>
      <Box className="flex flex-col justify-center items-center text-left" gap={2}>
        <Box className="flex flex-row justify-center items-center w-[500px]">
          <Typography variant="body1" sx={{ fontWeight: "bold", marginRight:2}}>
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
          <TextField placeholder="Enter lexicon name" className="w-full" />
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
            onClick={() => addNexWord()}
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
        <Button variant="contained" onClick={() => createNewLexicon()}>
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default LexiconEdit;
