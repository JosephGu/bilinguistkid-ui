import Link from "next/link";
import {
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import Image from "next/image";

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
    {
      title: "Literature",
      description:
        "Literature is a commonplace book to record interesting contents",
      link: "/literature",
      image: "/literature-logo.png",
    },
  ];
  return (
    <Box className="flex flex-col justify-center items-center relative">
      <Box
        sx={{
          width: "100%",
          height: "500px",
          // backgroundColor: "#FFFBE0",
          background: " #FFFBE0",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      ></Box>
      <Box
        className="flex flex-col justify-center items-center mt-10"
        sx={{
          maxWidth: "1280px",
          // margin: "20px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            fontSize: "2rem",
            mb: 6,
            p: 4,
            textAlign: "center",
            overflow: "hidden",
            display: { xs: "none", md: "flex" },
            position: "relative",
          }}
          className="flex flex-row justify-center items-center"
        >
          <Box flex={1}>
            <Typography
              gutterBottom
              className="text-4xl font-bold align-middle"
              sx={{
                color: "#FF8C00",
                fontSize: "2rem",
                fontWeight: "bold",
                textShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              Language is a skill <br />
              to acquire and express.
            </Typography>
          </Box>
          <Box flex={1} className="relative">
            <Image
              src="/great.png"
              alt="Happy background image"
              style={{
                objectFit: "cover",
                border: "4px solid white",
                borderRadius: "50% / 30%",
              }}
              priority={true}
              className="w-full h-full"
              width={1920}
              height={1042}
            />
          </Box>
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
            <Box sx={{ flex: "1 0 30%" }} key={item.title}>
              {/* <Paper> */}
              <Card variant="elevation" sx={{ height: "100%" }} elevation={3}>
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
        </Box>
      </Box>
      <footer>
        <Typography
          sx={{
            color: "#ccc",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          © 2023 BilinguistKid. All rights reserved.
        </Typography>
      </footer>
    </Box>
  );
}

export default Home;
