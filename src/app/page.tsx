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
  Paper,
} from "@mui/material";

function Home() {
  const cardList = [
    {
      title: "Fun Earth",
      description:
        "Fun Earth is a platform that helps children learn English with fun facts from the globe.",
      link: "/funEarth",
      image: "/earth-logo.png",
    },
    {
      title: "Lexicon Test",
      description: "Lexicon Test is a tool to test children's vocabulary.",
      link: "/lexicon",
      image: "/lexicon-logo.png",
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // margin: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          // maxWidth: 1000,
          // mx: "auto",
          fontSize: "2rem",
          // my: 6,
          mb: 6,
          p: 4,
          // borderRadius: 3,
          textAlign: "center",
          height: "80vh",
          // 柔和的绿色渐变背景色
          // background: "linear-gradient(45deg, lightyellow 30%, lightblue 90%)",
          // boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)", // 更柔和的阴影
          backgroundImage: "url('/happy.png')",
          backgroundSize: "contain",
          // position: "relative",
          overflow: "hidden",
          display: { xs: "none", md: "flex" },
        }}
        className="flex flex-col justify-center items-center"
      >
        <Box sx={{ flex: 1,}}>
          <Typography
            gutterBottom
            className="text-4xl font-bold align-middle"
            sx={{
              color: "white" ,fontSize: "2rem",fontWeight: "bold"
            }}
          >
            Explore, Learn,<br /> Grow In Two Languages!
          </Typography>
        </Box>
        {/* <Box sx={{ flex: 1 }}>
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
        </Box> */}
        {/* <Link href="/funEarth">
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
        </Link> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "20px",
          flexDirection: "row",
          flexWrap: "wrap",
          
        }}
        className="mb-10"
      >
        {cardList.map((item) => (
          <Box sx={{ flex: 1 }} key={item.title}>
            {/* <Paper> */}
              <Card variant="elevation" sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  sx={{
                    height: 100,
                    width: 100,
                    margin: "auto",
                  }}
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    className="text-center"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", width: "300px" }}
                    className="text-center"
                  >
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Link href={item.link}>
                    <Button size="small">Explore</Button>
                  </Link>
                </CardActions>
              </Card>
            {/* </Paper> */}
          </Box>
        ))}
        {/* Fun Earth is a platform that helps children learn English with
                fun facts from the globe.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Link href="/funEarth">
                <Button size="small">Explore</Button>
              </Link>
            </CardActions>
          </Card>
        </Box> */}
        {/* <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
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
        </Box> */}
        {/* <Box sx={{ flex: 1 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Lexicon Test
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", width: "300px" }}
              >
                  Lexicon Test is a tool to test children&apos;s vocabulary.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Link href="/lexiconTest">
                <Button size="small">Explore</Button>
              </Link>
            </CardActions>
          </Card>
        </Box> */}
      </Box>
    </Box>
  );
}

export default Home;
