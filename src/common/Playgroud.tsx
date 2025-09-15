"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogTitle,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Paper,
} from "@mui/material";

const Playgroud = (props: { open: boolean }) => {
  const router = useRouter();
  const exploreClick = () => {
    router.push("/funEarth");
  };
  return (
    <Dialog open={props.open} fullWidth>
      <DialogTitle>Playgroud</DialogTitle>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardMedia
              sx={{ height: 140 }}
              image="/globalChina.png"
              title="fun earth"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Fun Earth
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", width: "300px" }}
              >
                Fun Earth is a platform that helps children learn English with
                fun facts from the globe.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button size="small" onClick={exploreClick}>
                Explore
              </Button>
            </CardActions>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardMedia
              sx={{ height: 140 }}
              image="/topicGen.webp"
              title="Topic Generator"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Topic Generator
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", width: "300px" }}
              >
                Topic Generator is a tool to generate new topic for 1 on 1 talk.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button size="small" onClick={exploreClick}>
                Explore
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Playgroud;
