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
} from "@mui/material";

const Playgroud = () => {
  const router = useRouter();
  const exploreClick = () => {
    router.push("/funEarth");
  };
  return (
    <Dialog open fullWidth>
      <DialogTitle>Playgroud</DialogTitle>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap:"20px",
          alignItems: "center",
          margin:"20px"
        }}
      >
        <Card variant="outlined">
          <CardMedia
            sx={{ height: 140 }}
            image="/earth.png"
            title="fun earth"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Fun Earth
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Fun Earth is a platform that helps children learn English with fun
              facts from the globe. It provides a fun and interactive way for
              children to learn English.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button size="small" onClick={exploreClick}>
              Explore
            </Button>
            <Button size="small">Share</Button>
          </CardActions>
        </Card>
        <Card variant="outlined">
          <CardMedia
            sx={{ height: 140 }}
            image="/earth.png"
            title="fun earth"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Fun Earth
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Fun Earth is a platform that helps children learn English with fun
              facts from the globe. It provides a fun and interactive way for
              children to learn English.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center" }}>
            <Button size="small" onClick={exploreClick}>
              Explore
            </Button>
            <Button size="small">Share</Button>
          </CardActions>
        </Card>
      </Box>
    </Dialog>
  );
};

export default Playgroud;
