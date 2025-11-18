"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, IconButton } from "@mui/material";
import { TextAlign } from "@tiptap/extension-text-align";

import { motion } from "framer-motion";
import { Delete, Edit } from "@mui/icons-material";
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
import {
  createLiterature,
  deleteQuote,
  updateLiterature,
  getLiteratureByDate,
} from "@/app/actions/literature";
import { redirect } from "next/navigation";

interface Quote {
  id: string;
  content: JSONContent;
  date: Date;
}

export default function Literature() {
  //   const [quote, setQuote] = useState<JSONContent>({});
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const rteRef = useRef<RichTextEditorRef>(null);
  const rteEditRef = useRef<RichTextEditorRef>(null);
  const [editingId, setEditingId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<JSONContent | null>(
    null
  );

  const addQuote = async () => {
    const content = rteRef.current?.editor?.getJSON();
    console.log(typeof content);
    if (!content) return;
    console.log("rich text content:", JSON.stringify(content));
    const formData = new FormData();
    formData.append("content", JSON.stringify(content));

    const res = await createLiterature(formData);
    if (res.success) {
      const newQuote = res.data;
      if (newQuote) {
        setQuotes([
          ...quotes,
          {
            id: newQuote.id,
            content: newQuote.content as JSONContent,
            date: newQuote.date,
          },
        ]);
      }
    }

    rteRef.current?.editor?.chain().focus().clearContent().run();
  };

  useEffect(() => {
    const fetchQuates = async () => {
      try {
        const res = await getLiteratureByDate();

        if (!res.success) return;
        console.log(res.data);
        setQuotes(
          res.data?.map((item) => ({
            id: item.id,
            content: item.content as JSONContent,
            date: item.date,
          }))
        );
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "NO_TOKEN" || err.message === "NO_EMAIL") {
            redirect("/login");
          } else {
            setLoading(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuates();
  }, []);

  useEffect(() => {
    if (editingContent) {
      rteEditRef.current?.editor
        ?.chain()
        .focus()
        .setContent(editingContent)
        .run();
    }
  }, [editingContent]);

  const handleEditQuote = (id: string, content: JSONContent) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const handleUpdateQuote = async () => {
    const editingContent = rteEditRef.current?.editor?.getJSON();

    if (!editingId || !editingContent) return;
    try {
      const res = await updateLiterature(editingId, editingContent);
      if (res && res.success) {
        setQuotes(
          quotes.map((q) =>
            q.id === editingId
              ? { ...q, content: editingContent as JSONContent }
              : q
          )
        );
      }
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setEditingId("");
      setEditingContent(null);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const res = await deleteQuote(id);
      if (res && res.success) {
        setQuotes(quotes.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId("");
    rteEditRef.current?.editor?.chain().focus().clearContent().run();
  };

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
        Literature
      </motion.h1>

      <Card className="w-full max-w-xl p-4 mb-6 rounded-2xl shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <RichTextEditor
            ref={rteRef}
            extensions={[
              StarterKit,
              TextAlign.configure({
                types: [
                  "paragraph",
                  "heading",
                  "listItem",
                  "tableRow",
                  "tableCell",
                ],
                defaultAlignment: "left",
              }),
            ]}
            immediatelyRender={false}
            sx={{ minHeight: "200px" }}
            renderControls={() => (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
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
          quotes.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-2xl shadow-md ">
                <CardContent className="text-[12px] text-right">
                  <Box className="w-full flex flex-row items-center justify-between h-[24px]">
                    {new Date(q.date).toLocaleString("zh-CN", {
                      hour12: false,
                    })}
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditQuote(q.id, q.content)}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleDeleteQuote(q.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box className="w-full ">
                    {q.id === editingId ? (
                      <RichTextEditor
                        ref={rteEditRef}
                        extensions={[
                          StarterKit,
                          TextAlign.configure({
                            types: [
                              "paragraph",
                              "heading",
                              "listItem",
                              "tableRow",
                              "tableCell",
                            ],
                            defaultAlignment: "left",
                          }),
                        ]}
                        content={editingContent}
                        immediatelyRender={false}
                        sx={{ minHeight: "200px" }}
                        renderControls={() => (
                          <MenuControlsContainer>
                            <MenuSelectHeading />
                            <MenuDivider />
                            <MenuButtonBold />
                            <MenuButtonItalic />
                          </MenuControlsContainer>
                        )}
                      />
                    ) : (
                      <RichTextEditor
                        content={q.content}
                        extensions={[
                          StarterKit,
                          TextAlign.configure({
                            types: [
                              "paragraph",
                              "heading",
                              "listItem",
                              "tableRow",
                              "tableCell",
                            ],
                            defaultAlignment: "left",
                          }),
                        ]}
                        editable={false}
                        immediatelyRender={true}
                        sx={{
                          borderRadius: 0,
                          padding: 0,
                          border: 0,
                          "& .MuiTiptap-FieldContainer-notchedOutline": {
                            border: "none",
                          },
                        }}
                      />
                    )}
                    {q.id === editingId && (
                      <Box>
                        <Button
                          size="small"
                          onClick={() => handleUpdateQuote()}
                        >
                          Update
                        </Button>

                        <Button size="small" onClick={() => handleCancelEdit()}>
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </Box>
    </Box>
  );
}
