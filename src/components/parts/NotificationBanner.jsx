import React from "react";
import { Snackbar, Alert, Stack } from "@mui/material";
import { useNotification } from "../../contexts/NotificationContext";

export default function NotificationBanner() {
  const { notifications, removeNotification } = useNotification();

  return (
    <Stack
      spacing={2}
      sx={{ position: "fixed", top: 24, right: 24, zIndex: 9999 }}
    >
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity={notification.severity}
          onClose={() => removeNotification(notification.id)}
          sx={{
            width: "100%",
            minWidth: "300px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "16px",
            fontFamily: "Noto Sans Thai",
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
          variant="outlined"
        >
          {notification.message}
        </Alert>
      ))}
    </Stack>
  );
}
