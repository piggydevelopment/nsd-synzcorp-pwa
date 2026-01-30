import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

export default function ImageModal({ open, onClose, imageUrl }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg" // Allow it to be quite large
      fullWidth={false} // Don't force full width, let image dictate size up to maxWidth
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "hidden", // Hide scrollbars if image is huge
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <img
          src={imageUrl}
          alt="Large View"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
            borderRadius: "8px",
          }}
        />
      </Box>
    </Dialog>
  );
}
