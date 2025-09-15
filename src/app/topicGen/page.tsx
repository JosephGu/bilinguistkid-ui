"use client";

import { Box, Grid, Paper, Button } from "@mui/material";
import { useState } from "react";
import CasinoIcon from "@mui/icons-material/Casino";

const TopicGen = () => {
  const [selectedCard, setSelectedCard] = useState<number>(-1);
  const cards = [
    {
      id: 0,
      title: "Biology",
    },
    {
      id: 1,
      title: "Natural Science",
    },
    {
      id: 2,
      title: "Astronomy",
    },
    {
      id: 3,
      title: "Geography",
    },
    {
      id: 4,
      title: "Video Game",
    },
    {
      id: 11,
      title: "Sports",
    },
    {
      id: -10,
      title: "",
    },
    {
      id: -11,
      title: "",
    },
    {
      id: -12,
      title: "",
    },
    {
      id: 5,
      title: "Festivals ",
    },
    {
      id: 10,
      title: "History",
    },
    {
      id: 9,
      title: "Art",
    },
    {
      id: 8,
      title: "Technology",
    },
    {
      id: 7,
      title: "Architecture",
    },
    {
      id: 6,
      title: "Custom",
    },
  ];

  const findaRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * 100 + 12);

    const rotateCards = (currentIndex: number, currentCardId: number) => {
      const timeGap = randomIndex - currentIndex < 10 ? 200 : 100;
      if (currentIndex < randomIndex) {
        setTimeout(() => {
          const nextId = currentCardId === 11 ? 0 : currentCardId + 1;
          console.log(nextId);
          setSelectedCard(nextId);
          rotateCards(currentIndex + 1, nextId);
        }, timeGap);
      }
    };
    rotateCards(0, selectedCard);
  };

  return (
    <Box sx={{ flexGrow: 1, margin: "20px" }}>
      <Grid container spacing={2} columns={{ xs: 5, sm: 5, md: 5 }}>
        {cards.map((card, index) => (
          <Grid
            key={index}
            size={{ xs: 1, sm: 1, md: 1 }}
            sx={{ opacity: card.id < -1 ? 0 : 1 }}
          >
            <Paper
              sx={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: selectedCard === card.id ? "red" : "",
              }}
            >
              {card.title}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button onClick={findaRandomCard} startIcon={<CasinoIcon />}>
        Generate
      </Button>
      <div>Current Card: {selectedCard}</div>
    </Box>
  );
};

export default TopicGen;
