import Link from "next/link";
import {
  // Dialog,
  // DialogTitle,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
      }}
    >
      <Box
        sx={{
          width: "80%",
          // maxWidth: 1000,
          // mx: "auto",
          fontSize: "2rem",
          my: 6,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          // 柔和的绿色渐变背景色
          background: "linear-gradient(45deg, lightyellow 30%, lightblue 90%)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)", // 更柔和的阴影
          position: "relative",
          overflow: "hidden",
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography gutterBottom color="text.primary">
          Explore, Learn, Grow In Two Languages!
        </Typography>
        <Typography
          variant="body1"
          paragraph
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 3,
          }}
        >
          This Website is for our beloved children who want to learn English.
        </Typography>
        <Link href="/funEarth">
          <Button
            variant="contained"
            color="primary"
            sx={{
              color: "#FFFFFF", // 按钮文字保持白色
            }}
          >
            {" "}
            START EXPLORING NOW!
          </Button>
        </Link>
      </Box>
      <Box sx={{ display: "flex", gap: "20px", flexDirection: "row", flexWrap: "wrap" }}>
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardMedia
              sx={{ height: 260 }}
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
              <Link href="/funEarth">
                <Button size="small">Explore</Button>
              </Link>
            </CardActions>
          </Card>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardMedia
              sx={{ height: 260 }}
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
              <Link href="/topicGen">
                <Button size="small">Explore</Button>
              </Link>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
