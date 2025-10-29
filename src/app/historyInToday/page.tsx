"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";

const cardList = [
  {
    id: "physics",
    name: "Physics",
    description:
      "Physics is the study of matter, energy, and their interactions. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description:
      "Chemistry is the study of matter and its changes. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "biology",
    name: "Biology",
    description:
      "Biology is the study of life and its interactions with the environment. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "history",
    name: "History",
    description:
      "History is the study of the past. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "geography",
    name: "Geography",
    description:
      "Geography is the study of the earth and its environment. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "math",
    name: "Math",
    description:
      "Math is the study of numbers, shapes, and patterns. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "astronomy",
    name: "Astronomy",
    description:
      "Astronomy is the study of the universe and its components. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "art",
    name: "Art",
    description:
      "Art is the study of visual and spatial expressions. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
  {
    id: "comuputerScience",
    name: "Computer Science",
    description:
      "Computer Science is the study of computers and their applications. It is a fundamental science that underpins much of our understanding of the world around us.",
  },
];

export default function HistoryInTodayPage() {
  const [selectedCard, setSelectedCard] = useState("");
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: 2,
        }}
      >
        {cardList.map((item) => (
          <Card
            key={item.id}
            // sx={{ minWidth: 275 }}
            onClick={() => setSelectedCard(item.id)}
            className={selectedCard === item.id ? "selected" : ""}
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom
              >
                {item.name}
              </Typography>
              <Typography sx={{ fontSize: 14 }} variant="h5" component="div">
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
