"use client";

import { useEffect } from "react";

import { Dialog, Box, Button, TextField } from "@mui/material";

function ClassroomPage() {
  return (
    <Dialog open fullWidth>
      <Box className="m-8 align-items-center flex justify-center flex-col">
        <Box className="flex flex-col items-center justify-center">
          <TextField
            label="Class Code"
            variant="outlined"
            className="d-block"
          ></TextField>
        </Box>
        <Box className="flex flex-row items-center justify-center">
          <Button>Launch Class</Button>
          <Button>Join Class</Button>
        </Box>
      </Box>
    </Dialog>
  );
}
export default ClassroomPage;
