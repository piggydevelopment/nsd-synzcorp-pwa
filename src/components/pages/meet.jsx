import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import CallEndIcon from "@mui/icons-material/CallEnd";
import api from "../../utils/api";
import Chat from "./chat";
import { ReactSession } from "react-client-session";
import dayjs from "dayjs";

export function MeetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    room,
    consult,
    consultProfile,
    meeting_room_url,
    second_meeting_room_url,
  } = location.state || {}; // Extract passed state

  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = ReactSession.get("user");
  const meetingUrl = meeting_room_url || second_meeting_room_url;

  const [meet_info, setMeetInfo] = useState({
    user_id: user.id,
    appointment_number: room,
    start_datetime: "",
    end_datetime: "",
  });

  // Effect to load any existing meeting state if user refreshes?
  // Maybe not critical for this simple flow, but good to ensure room is set.
  useEffect(() => {
    // If no room state, maybe redirect back?
    if (!room) {
      // Handle error case
    }
  }, [room]);

  const handleJoinMeeting = async () => {
    setLoading(true);
    const startData = {
      ...meet_info,
      start_datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    // 1. Call Start API
    try {
      await api.post("/api/appointment/meetingroom/start", startData);
      setMeetInfo(startData);

      // Save to local storage in case of refresh (optional logic from before)
      localStorage.setItem("meet_" + room, JSON.stringify(startData));
    } catch (error) {
      console.error("Error starting meeting:", error);
      // Proceed anyway?
    }

    // 2. Open Meeting in New Tab
    window.open(meetingUrl, "_blank");

    // 3. Update UI
    setHasJoined(true);
    setLoading(false);
  };

  const handleEndMeeting = async () => {
    setLoading(true);
    const endData = {
      user_id: user.id,
      appointment_number: room,
      start_datetime:
        meet_info.start_datetime || dayjs().format("YYYY-MM-DD HH:mm:ss"), // Fallback if user didn't click join logic correctly
      end_datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      await api.post("/api/appointment/meetingroom/end", endData);

      // Clear local storage
      localStorage.setItem("meet_" + room, "");

      // Navigate to Question
      navigate("/question", { state: location.state });
    } catch (error) {
      console.error("Error ending meeting:", error);
      // Proceed to question anyway?
      navigate("/question", { state: location.state });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F6F6F6",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Chat disabled={true} />{" "}
      {/* Keep chat background/context if needed, or maybe remove? Original code had it. */}
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: "24px",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
            overflow: "visible",
            mt: -4, // visual offset if needed
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Profile Image (Consultant) */}
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={consultProfile}
                alt={consult}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid #FFF",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  bgcolor: "#E0E0E0",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  bgcolor: "#27AE60",
                  borderRadius: "50%",
                  border: "3px solid #FFF",
                }}
              />
            </Box>

            <Typography
              className="NotoSansThai"
              variant="h5"
              sx={{ fontWeight: 700, color: "#333", mb: 0.5 }}
            >
              {consult || "Specialist"}
            </Typography>
            <Typography
              className="NotoSansThai"
              sx={{ color: "#888", fontSize: "14px", mb: 4 }}
            >
              ห้องสนทนา #{room}
            </Typography>

            <Divider sx={{ mb: 4, borderStyle: "dashed" }} />

            {!hasJoined ? (
              <Box>
                <Typography
                  className="NotoSansThai"
                  sx={{ color: "#666", mb: 3, lineHeight: 1.6 }}
                >
                  กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ห้องสนทนา
                  <br />
                  ระบบจะเปิดหน้าต่างใหม่สำหรับการประชุม
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleJoinMeeting}
                  disabled={loading}
                  startIcon={<VideoCameraFrontIcon />}
                  className="NotoSansThai"
                  sx={{
                    borderRadius: "50px",
                    width: "100%",
                    py: 1.8,
                    fontSize: "16px",
                    fontWeight: 600,
                    backgroundColor: "#461E99",
                    boxShadow: "0 8px 20px rgba(70, 30, 153, 0.3)",
                    "&:hover": {
                      backgroundColor: "#351578",
                    },
                  }}
                >
                  เข้าสู่ห้องสนทนา
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography
                  className="NotoSansThai"
                  sx={{ color: "#27AE60", fontWeight: 600, mb: 1 }}
                >
                  กำลังดำเนินการสนทนา...
                </Typography>

                {/* Fallback for popup blocker */}
                <Typography
                  className="NotoSansThai"
                  sx={{
                    color: "#555",
                    fontSize: "15px",
                    mb: 2,
                    bgcolor: "#F0F0F0",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  เรากำลังจะพาคุณไปยังหน้าห้องสนทนา... <br />
                  หากหน้าต่างไม่ปรากฏขึ้น{" "}
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#461E99",
                      textDecoration: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    คลิกที่นี่เพื่อเปิดหน้าต่างใหม่
                  </a>
                </Typography>

                <Typography
                  className="NotoSansThai"
                  sx={{ color: "#888", fontSize: "14px", mb: 4 }}
                >
                  เมื่อการสนทนาเสร็จสิ้น กรุณากดปุ่มด้านล่าง
                  <br />
                  เพื่อทำแบบประเมินและสิ้นสุดรายการ
                </Typography>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleEndMeeting}
                  disabled={loading}
                  startIcon={<CallEndIcon />}
                  className="NotoSansThai"
                  sx={{
                    borderRadius: "50px",
                    width: "100%",
                    py: 1.8,
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#D32F2F",
                    borderColor: "#D32F2F",
                    borderWidth: "2px",
                    "&:hover": {
                      borderColor: "#B71C1C",
                      backgroundColor: "#FFEBEE",
                      borderWidth: "2px",
                    },
                  }}
                >
                  สิ้นสุดการสนทนา
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
