import { Close } from "@mui/icons-material";
import { Box, IconButton, LinearProgress } from "@mui/material";

const Progress = ({
  currIdx,
  total,
  onExitTest,
}: {
  currIdx: number;
  total: number;
  onExitTest: () => void;
}) => {
  return (
    <Box className="w-full flex justify-center items-center gap-4">
      <Box className="flex-1">
        {currIdx + 1}/{total}
      </Box>
      <Box className="flex-[8]">
        <LinearProgress
          sx={{ width: "100%", height: 10 }}
          variant="determinate"
          value={((currIdx + 1) / total) * 100}
        />
      </Box>
      <Box className="flex-1">
        <IconButton onClick={() => onExitTest()} color="primary">
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Progress;
