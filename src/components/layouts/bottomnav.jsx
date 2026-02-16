import React, { useState, useEffect, Component } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { BrowserRouter as Router, Link, Outlet } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { useNotification } from "../../contexts/NotificationContext";

export function LayoutBottomNav() {
  const { unreadChatCount } = useNotification();
  const [value, setValue] = React.useState(0);
  return (
    <Box sx={{ backgroundColor: "#F6F6F6", paddingBottom: "84px" }}>
      <Outlet />
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: "567px",
          m: "0 auto",
          zIndex: 100,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          sx={{
            height: "84px",
          }}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            component={Link}
            to="/home"
            label="หน้าหลัก"
            icon={<HomeSharpIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/history"
            label="ประวัติ"
            icon={<HistorySharpIcon />}
          />
          <BottomNavigationAction
            component={Link}
            to="/account"
            label="บัญชี"
            icon={<PersonOutlineOutlinedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
