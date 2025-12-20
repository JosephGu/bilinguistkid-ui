"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
} from "@mui/material";
import { TextAlign } from "@tiptap/extension-text-align";

import { motion } from "framer-motion";
import {
  ArrowUpward,
  Delete,
  DeleteForever,
  Edit,
  Filter,
  FilterAlt,
  Restore,
  SortByAlpha,
  ArrowDownward,
  Mic,
} from "@mui/icons-material";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonRedo,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  MenuButtonTextColor,
  type RichTextEditorRef,
} from "mui-tiptap";
import type { JSONContent } from "@tiptap/core";
import { useRef } from "react";
import {
  createLiterature,
  deleteLiterature,
  updateLiterature,
  getLiteratureByDate,
  softDeleteLiterature,
  restoreLiterature,
} from "@/app/actions/literature";
import { redirect } from "next/navigation";
import { TimeRange } from "@/app/shared/TimeRange";
import { RestoreFromTrash, FolderOpen } from "@mui/icons-material";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface Quote {
  id: string;
  content: JSONContent;
  date: Date;
  deleted: boolean;
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
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.ThisWeek);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [ascSort, setAscSort] = useState<boolean>(false);

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
          {
            id: newQuote.id,
            content: newQuote.content as JSONContent,
            date: newQuote.date,
            deleted: false,
          },
          ...quotes,
        ]);
      }
    }

    rteRef.current?.editor?.chain().focus().clearContent().run();
  };

  const fetchQuates = async () => {
    try {
      const res = await getLiteratureByDate(timeRange);

      if (!res.success) return;
      console.log(res.data);
      setQuotes(
        res.data?.map((item) => ({
          id: item.id,
          content: item.content as JSONContent,
          date: item.date,
          deleted: item.deleted,
        }))
      );
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "NO_TOKEN" || err.message === "NO_EMAIL" || err.message === "INVALID_TOKEN") {
          redirect("/login");
        } else {
          setLoading(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuates();
  }, []);

  useEffect(() => {
    fetchQuates();
  }, [timeRange]);

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

  const handleHardDeleteQuote = async (id: string) => {
    try {
      const res = await deleteLiterature(id);
      if (res && res.success) {
        setQuotes(quotes.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleSoftDeleteQuote = async (id: string) => {
    try {
      const res = await softDeleteLiterature(id);
      if (res && res.success) {
        setQuotes(
          quotes.map((q) => (q.id === id ? { ...q, deleted: true } : q))
        );
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleRestoreQuote = async (id: string) => {
    try {
      const res = await restoreLiterature(id);
      if (res && res.success) {
        setQuotes(
          quotes.map((q) => (q.id === id ? { ...q, deleted: false } : q))
        );
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
      className="w-full flex flex-col justify-center items-center p-6 justify-self-center"
      sx={{
        maxWidth: "1200px",
      }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Literature
      </motion.h1>

      <Card className="w-full p-4 mb-6 rounded-2xl shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <RichTextEditor
            ref={rteRef}
            extensions={[
              StarterKit,
              TextStyle,
              Color,
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
                <MenuButtonTextColor />
                <MenuButtonUndo />
                <MenuButtonRedo />
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
      <Box className="w-full flex flex-col">
        <Box className="w-full text-right">
          {!showDeleted && (
            <IconButton onClick={() => setShowFilter(!showFilter)}>
              <FilterAlt />
            </IconButton>
          )}
          <IconButton onClick={() => setShowDeleted(!showDeleted)}>
            {!showDeleted ? <RestoreFromTrash /> : <FolderOpen />}
          </IconButton>
          <IconButton onClick={() => setAscSort(!ascSort)}>
            {ascSort ? <ArrowUpward /> : <ArrowDownward />}
          </IconButton>
        </Box>

        {quotes.length === 0 && (
          <p className="text-center text-gray-700 p-2">
            {showDeleted
              ? "No deleted quotes yet."
              : "No quotes yet. Start adding!"}
          </p>
        )}

        {quotes.length > 0 &&
          quotes
            .filter((q) => (showDeleted ? q.deleted : !q.deleted))
            .sort((a, b) =>
              ascSort
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="rounded-2xl shadow-md mt-6">
                  <CardContent className="text-[12px] text-right">
                    <Box className="w-full flex flex-row items-center justify-between h-[24px] pl-[12px]">
                      {new Date(q.date).toLocaleString("zh-CN", {
                        hour12: false,
                      })}
                      {!q.deleted ? (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEditQuote(q.id, q.content)}
                          >
                            <Edit />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleSoftDeleteQuote(q.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRestoreQuote(q.id)}
                          >
                            <Restore />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleHardDeleteQuote(q.id)}
                          >
                            <DeleteForever />
                          </IconButton>
                        </Box>
                      )}
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
                              <MenuButtonTextColor />
                              <MenuButtonUndo />
                              <MenuButtonRedo />
                            </MenuControlsContainer>
                          )}
                        />
                      ) : (
                        <RichTextEditor
                          content={q.content}
                          extensions={[
                            StarterKit,
                            TextStyle,
                            Color,
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

                          <Button
                            size="small"
                            onClick={() => handleCancelEdit()}
                          >
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
      <Drawer
        anchor="bottom"
        open={showFilter}
        onClose={() => setShowFilter(false)}
      >
        <Box
          sx={{
            maxWidth: 1200,
            margin: "24px auto",
          }}
        >
          <Box className="m-2">
            <ToggleButtonGroup
              value={timeRange}
              onChange={(e, value) => setTimeRange(value)}
              size="small"
              exclusive
            >
              <ToggleButton
                value={TimeRange.All}
                selected={timeRange === TimeRange.All}
              >
                All
              </ToggleButton>
              <ToggleButton
                value={TimeRange.ThisMonth}
                selected={timeRange === TimeRange.ThisMonth}
              >
                This Month
              </ToggleButton>
              <ToggleButton
                value={TimeRange.ThisWeek}
                selected={timeRange === TimeRange.ThisWeek}
              >
                This Week
              </ToggleButton>
              <ToggleButton
                value={TimeRange.Last7Days}
                selected={timeRange === TimeRange.Last7Days}
              >
                Last 7 Days
              </ToggleButton>
              <ToggleButton
                value={TimeRange.Today}
                selected={timeRange === TimeRange.Today}
              >
                Today
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {/* <Box className="m-2">
            <ToggleButtonGroup
              value={ascSort}
              onChange={(e, value) => setAscSort(value)}
              size="small"
              exclusive
            >
              <ToggleButton value={false} selected={!ascSort}>
                Descend
              </ToggleButton>
              <ToggleButton value={true} selected={ascSort}>
                Ascend
              </ToggleButton>
            </ToggleButtonGroup>
          </Box> */}
          {/* <Box className="m-2">
            <ToggleButtonGroup
              value={showDeleted}
              onChange={(e, value) => setShowDeleted(value)}
              size="small"
              exclusive
            >
              <ToggleButton value={false} selected={!showDeleted}>
                Show All
              </ToggleButton>
              <ToggleButton value={true} selected={showDeleted}>
                Show Deleted
              </ToggleButton>
            </ToggleButtonGroup>
          </Box> */}
        </Box>
      </Drawer>
    </Box>
  );
}
