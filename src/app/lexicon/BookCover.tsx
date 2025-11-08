import React from "react";
import { Paper, Box, Typography } from "@mui/material";

interface BookCoverProps {
  name: string;
  onClick?: (id: string) => void;
  id: string;
}

export default function BookCover({ name, onClick, id }: BookCoverProps) {
  const color = "#f4e3c1"; // 封面主色
  const accentColor = "#b08b56"; // 书脊颜色
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        cursor: "pointer",
        // background: "linear-gradient(180deg, #f5f3ef, #eae6df)",
      }}
      onClick={() => onClick?.(id)}
    >
      <Box
        sx={{
          perspective: "1000px",
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
            transform: "rotateY(-15deg)",
            transformStyle: "preserve-3d",
            boxShadow: `
              -10px 6px 15px rgba(0,0,0,0.15),
              inset -3px 0 4px rgba(0,0,0,0.1)
            `,
            transition: "transform 0.4s ease",
            "&:hover": {
              transform: "rotateY(-5deg) translateY(-4px)",
            },
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {/* 书脊 */}
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

          {/* 封面内容 */}
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
            {/* <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              {author}
            </Typography> */}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
