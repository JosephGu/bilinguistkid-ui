"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Button, Card, CardContent, IconButton } from "@mui/material";

import { motion } from "framer-motion";
import { Delete } from "@mui/icons-material";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import type { JSONContent } from "@tiptap/core";
import { useRef } from "react";

interface Quote {
  id: number;
  text: JSONContent;
}

export default function CommonplaceBook() {
  const [quote, setQuote] = useState<JSONContent>({});
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const addQuote = () => {
    const content = rteRef.current?.editor?.getJSON();
    console.log(typeof content);
    if (!content) return;
    console.log("rich text content:", content);
    const newQuote = { id: Date.now(), text: content };
    setQuotes([newQuote, ...quotes]);
    setQuote({});
  };
  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <Box
      className="min-h-screen w-full flex flex-col items-center p-6 "
      sx={{
        backgroundColor: "#FFFBE0",
      }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Children&apos;s Commonplace Book
      </motion.h1>

      {/* Input Section */}
      <Card className="w-full max-w-xl p-4 mb-6 rounded-2xl shadow-lg">
        <CardContent className="flex flex-col gap-4">
          {/* <TextField
            label="Write a beautiful sentence..."
            variant="outlined"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="bg-white rounded-xl"
          /> */}
          <RichTextEditor
            ref={rteRef}
            extensions={[StarterKit]} // Or any Tiptap extensions you wish!
            content="" // Initial content for the editor
            // Optionally include `renderControls` for a menu-bar atop the editor:
            immediatelyRender={false}
            renderControls={() => (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                {/* Add more controls of your choosing here */}
              </MenuControlsContainer>
            )}
          />

          <Button
            variant="contained"
            onClick={addQuote}
            className="!rounded-xl !py-2"
          >
            Add Quote
          </Button>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <Box className="w-full max-w-xl flex flex-col gap-4">
        {quotes.length === 0 && (
          <p className="text-center text-gray-700">
            No quotes yet. Start adding!
          </p>
        )}

        {quotes.length > 0 &&
          quotes.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-2xl shadow-md ">
                <Box className="w-full flex flex-row items-center justify-between">
                  <CardContent className="text-[12px] text-right">
                    {new Date(q.id).toLocaleString("zh-CN", {
                      hour12: false,
                    })}
                  </CardContent>
                  <IconButton size="small">
                    <Delete />
                  </IconButton>
                </Box>
                <Box className="w-full ">
                  {/* <CardContent className="p-4 text-lg">{q.text}</CardContent>
                   */}
                  <RichTextEditor
                    sx={{ borderRadius: 0, padding: 0, border: 0 }}
                    content={q.text}
                    extensions={[StarterKit]}
                    editable={false}
                    immediatelyRender={false}
                  />
                </Box>
              </Card>
            </motion.div>
          ))}
      </Box>
    </Box>
  );
}
