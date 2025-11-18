import React from "react";
import { Paper, Box, Typography } from "@mui/material";

interface BookCoverProps {
  name: string;
  onClick?: (id: string) => void;
  id: string;
}

export default function BookCover({ name, onClick, id }: BookCoverProps) {
  const color = "#f4e3c1";
  const accentColor = "#b08b56";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => onClick?.(id)}
    >
      <Box
        sx={{
          perspective: "1800px",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            margin: "20px",
            position: "relative",
            width: 250,
            height: 300,
            borderRadius: "4px",
            background: `linear-gradient(145deg, ${color}, #fff8e8)`,
            transformStyle: "preserve-3d",
            fontFamily: "'Playfair Display', serif",
            backdropFilter: "blur(10px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            transform: "scale(1)",
            transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
            "&:hover": {
              transform: "scale(1.05)", 
              boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.45)",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "30px",
              background: `linear-gradient(180deg, ${accentColor}, #8a6a3e)`,
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
              boxShadow: "inset -2px 0 5px rgba(0,0,0,0.2)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "30px",
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: 3,
              color: "#4b3d2a",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 2,
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {name}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
