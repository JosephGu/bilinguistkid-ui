import { Modal, Box, Typography, CircularProgress } from "@mui/material";

const LoadingModal = (props: { open: boolean }) => {
  return (
    <Modal
      open={props.open}
      onClose={() => {}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "0",
          boxShadow: 24,
        }}
      >
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: "center", top: "50%" , height:"100px"}}
        >
          <CircularProgress />
          Loading...
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoadingModal;
