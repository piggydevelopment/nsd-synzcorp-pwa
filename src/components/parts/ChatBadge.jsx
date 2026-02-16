import React, { useEffect } from "react";
import { Badge, Box } from "@mui/material";
import { useNotification } from "../../contexts/NotificationContext";

export default function ChatBadge() {
  const { unreadChatCount, clearUnreadChat } = useNotification();

  useEffect(() => {
    if (unreadChatCount === 0) return;

    const handleClick = (e) => {
      // Global listener for clicks in the bottom-right region (widget area)
      const rightDist = window.innerWidth - e.clientX;
      const bottomDist = window.innerHeight - e.clientY;

      // If click is within 150px of bottom-right, clear it.
      // This covers the widget button area usually.
      if (rightDist < 150 && bottomDist < 200) {
        clearUnreadChat();
      }
    };

    const handleMessage = (e) => {
      if (e.data && e.data.type === "synz_chat_opened") {
        clearUnreadChat();
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
      window.removeEventListener("message", handleMessage);
    };
  }, [unreadChatCount, clearUnreadChat]);

  if (unreadChatCount === 0) return null;

  return (
    <Box
      onClick={clearUnreadChat}
      sx={{
        position: "fixed",
        bottom: "130px",
        right: "30px",
        zIndex: 99999,
        cursor: "pointer",
        // pointerEvents removed to allow clicking (defaults to auto)
      }}
    >
      <Badge
        color="error"
        variant="dot"
        sx={{
          "& .MuiBadge-badge": {
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "red",
            border: "2px solid white",
          },
        }}
      >
        <Box sx={{ width: 1, height: 1 }} />
      </Badge>
    </Box>
  );
}
