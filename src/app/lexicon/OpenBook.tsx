import React from "react";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function OpenBook({
  name,
  list,
  onDelete,
  onEdit,
  id,
}: {
  name: string | undefined;
  list: string[];
  id: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteName, setDeleteName] = React.useState("");

  const toggleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
  };
  const handleDelete = () => {
    toggleDialogOpen(true);
  };

  const handleClose = () => {
    toggleDialogOpen(false);
    setDeleteName("");
  };

  const handleDeleteConfirm = () => {
    if (deleteName !== name) {
      alert("Please Input Corrent Book Name");
      return;
    }
    onDelete(id);
    toggleDialogOpen(false);
    setDeleteName("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1200px",
        padding: "60px 0",
      }}
    >
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary" }}>
            Are you sure you want to delete this book? confirm:
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Book Name"
            type="text"
            fullWidth
            variant="standard"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
          />
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            Please input <b>{name}</b> to confirm deletion.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          gap: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "linear-gradient(to bottom, #b7a48b, #d3c4a8)",
            zIndex: 2,
          }}
        />
        <Paper
          elevation={4}
          sx={{
            width: 300,
            height: 400,
            padding: 3,
            background: "linear-gradient(135deg, #fffaf0, #f1e7d2)",
            borderRight: "1px solid #d4cbb7",
            boxShadow: `
              inset -2px 0 3px rgba(0,0,0,0.1),
              -6px 4px 10px rgba(0,0,0,0.1)
            `,
            transform: "rotateY(4deg)",
            transformOrigin: "right center",
            fontFamily: "'Merriweather', serif",
            lineHeight: 1.8,
            zIndex: 1,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {name}
          </Typography>
          {list &&
            list.map(
              (item, index) =>
                index < 15 && (
                  <Box key={item}>
                    <Typography variant="body2">{item}</Typography>
                  </Box>
                )
            )}
        </Paper>

        {/* 右页 */}
        <Paper
          elevation={4}
          sx={{
            width: 300,
            height: 400,
            padding: 3,
            background: "linear-gradient(135deg, #fffaf0, #f8eed8)",
            borderLeft: "1px solid #d4cbb7",
            boxShadow: `
              inset 2px 0 3px rgba(0,0,0,0.1),
              6px 4px 10px rgba(0,0,0,0.1)
            `,
            transform: "rotateY(-4deg)",
            transformOrigin: "left center",
            fontFamily: "'Merriweather', serif",
            lineHeight: 1.8,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "right" }}
          >
            <Button
              startIcon={<Delete />}
              onClick={() => {
                handleDelete();
              }}
            ></Button>
            <Button
              startIcon={<Edit />}
              onClick={() => {
                onEdit(id);
              }}
            ></Button>
          </Typography>
          {list &&
            list.map(
              (item, index) =>
                index >= 15 &&
                index < 30 && (
                  <Box key={item}>
                    <Typography variant="body2">{item}</Typography>
                  </Box>
                )
            )}
        </Paper>
      </Box>
    </Box>
  );
}
