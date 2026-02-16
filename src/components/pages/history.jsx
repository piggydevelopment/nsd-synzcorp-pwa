import React, { useState, useEffect, useMemo } from "react";
import {
  Stack,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import Loading from "../parts/loading";
import api from "../../utils/api";

// Helper components
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
      style={{ height: "100%", width: "100%" }}
    >
      {value === index && <Box sx={{ pt: 2, pb: 2 }}>{children}</Box>}
    </div>
  );
};

const StatusChip = ({ statusId, isOverdue }) => {
  let label = "สถานะไม่ระบุ";
  let color = "default";
  let bgcolor = "#E0E0E0";
  let textColor = "#000";

  const numStatus = parseInt(statusId);

  // If status is Pending (1) or Confirmed (2) but time has passed, show "Overdue"
  if (isOverdue && (numStatus === 1 || numStatus === 2)) {
    label = "เลยกำหนด";
    color = "error";
    bgcolor = "#FFEBEE"; // Light red
    textColor = "#D32F2F"; // Dark red
  } else {
    switch (numStatus) {
      case 1:
        label = "รอการยืนยัน";
        color = "warning";
        bgcolor = "#FFF4E5";
        textColor = "#FF7D45";
        break;
      case 2:
        label = "ยืนยันแล้ว";
        color = "success";
        bgcolor = "#E8F5E9";
        textColor = "#27AE60";
        break;
      case 3:
        label = "เสร็จสิ้น";
        color = "default";
        bgcolor = "#F5F5F5";
        textColor = "#656565";
        break;
      case 4:
        label = "ยกเลิก";
        color = "error";
        bgcolor = "#FFEBEE";
        textColor = "#D32F2F";
        break;
      case 5:
        label = "ใช้บริการแล้ว";
        color = "success";
        bgcolor = "#461E99";
        textColor = "#F5F5F5";
        break;
      default:
        break;
    }
  }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: bgcolor,
        color: textColor,
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "6px",
        fontFamily: "NotoSansThai",
      }}
    />
  );
};

const AppointmentCard = React.memo(({ booking, user, navigate }) => {
  // Helpers to calculate times
  const appointmentDateObj = new Date(booking.appointment_date);
  // Construct a full date check.
  // Assuming booking.appointment_time is "HH:mm" or "HH:mm:ss"
  // Safe approach: Combine Strings for comparison
  const dateTimeStr = `${booking.appointment_date}T${booking.appointment_time}`;
  // Note: T separator works well for ISO-like dates if env supports it.
  // Or just "YYYY-MM-DD HH:mm" usually works in new Date() in generic JS environments.
  const apptDateTime = new Date(
    `${booking.appointment_date} ${booking.appointment_time}`,
  );
  const now = new Date();

  // Overdue check for StatusChip only (still mark as overdue if past start time)
  const isOverdue = now > apptDateTime;

  // New logic for Enter Room button:
  // 1. Status is Confirmed (2)
  // 2. Current time is at or after (Appointment Time - 1 hour)
  const oneHourBefore = new Date(apptDateTime.getTime() - 60 * 60 * 1000);
  const isConfirmedStatus = parseInt(booking.appointment_status_id) === 2;

  const canEnterRoom = isConfirmedStatus && now >= oneHourBefore;

  const handleEnterRoom = () => {
    let data = {
      room: booking.number,
      bookingId: booking.id,
      consult: `${booking.Specialist?.prefix || ""}${booking.Specialist?.firstname || ""} ${booking.Specialist?.lastname || ""}`,
      consultProfile: booking.Specialist?.profile_pic_file_name || "",
      user: `${user.firstname} ${user.lastname}`,
      meeting_room_url:
        booking.meeting_room_url || booking.second_meeting_room_url,
    };

    localStorage.setItem("current_meet", JSON.stringify(data));

    navigate("/meet", { state: data });
  };

  const formattedDate = appointmentDateObj.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        mb: 2,
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: "16px !important" }}>
        {/* Header: ID and Status */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            className="NotoSansThai"
            sx={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            #{booking.number}
          </Typography>
          <StatusChip
            statusId={booking.appointment_status_id}
            isOverdue={isOverdue}
          />
        </Stack>

        <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

        {/* Doctor Info */}
        <Stack direction="row" spacing={2} mb={2}>
          <Avatar
            src={booking.Specialist?.profile_pic_file_name}
            sx={{ width: 56, height: 56, border: "2px solid #F0F0F0" }}
          />
          <Box>
            <Typography
              className="NotoSansThai"
              sx={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#333",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {booking.Specialist?.firstname} {booking.Specialist?.lastname}
            </Typography>
            <Typography
              className="NotoSansThai"
              sx={{ fontSize: "13px", color: "#666" }}
            >
              {booking.Specialist?.type || "ผู้เชี่ยวชาญ"}
            </Typography>
          </Box>
        </Stack>

        {/* Date Time Info */}
        <Box
          sx={{
            backgroundColor: "#F8F9FA",
            borderRadius: "12px",
            p: 1.5,
            borderRadius: "12px",
            p: 1.5,
            mb: canEnterRoom ? 2 : 0,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <CalendarMonthIcon sx={{ color: "#461E99", fontSize: 20 }} />
            <Typography
              className="NotoSansThai"
              sx={{ fontSize: "14px", color: "#333", fontWeight: 500 }}
            >
              {formattedDate}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon sx={{ color: "#461E99", fontSize: 20 }} />
            <Typography
              className="NotoSansThai"
              sx={{ fontSize: "14px", color: "#333", fontWeight: 500 }}
            >
              {booking.appointment_time} น.
            </Typography>
          </Stack>
        </Box>

        {/* Action Button */}
        {canEnterRoom && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleEnterRoom}
            startIcon={<VideoCameraFrontIcon />}
            endIcon={<NavigateNextIcon />}
            sx={{
              mt: 1,
              backgroundColor: "#461E99",
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "NotoSansThai",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(70, 30, 153, 0.2)",
              "&:hover": {
                backgroundColor: "#351578",
              },
            }}
          >
            เข้าห้องสนทนา
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

export function HistoryPage() {
  const [user] = useState(ReactSession.get("user"));
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0); // 0: Upcoming, 1: Past
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getBookingHistory();
    }
  }, [user]);

  const getBookingHistory = async () => {
    try {
      const response = await api.get(`/api/appointment/${user.id}`);
      const data = response.data?.data || [];
      setBooking(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Filter and sort bookings
  const { upcomingBookings, pastBookings } = useMemo(() => {
    // 1=Pending, 2=Confirmed -> Upcoming IF NOT OVERDUE
    // 3=Completed, 4=Cancelled OR Overdue -> Past

    const now = new Date();

    const getDate = (b) =>
      new Date(`${b.appointment_date} ${b.appointment_time}`);

    const isOverdue = (b) => {
      const apptDate = getDate(b);
      return now > apptDate;
    };

    const upcoming = booking
      .filter((b) => {
        const status = parseInt(b.appointment_status_id);
        return [1, 2].includes(status) && !isOverdue(b);
      })
      .sort((a, b) => getDate(a) - getDate(b)); // Ascending

    const past = booking
      .filter((b) => {
        const status = parseInt(b.appointment_status_id);
        // Include completed/cancelled OR (pending/confirmed AND overdue)
        return ![1, 2].includes(status) || isOverdue(b);
      })
      .sort((a, b) => getDate(b) - getDate(a)); // Descending

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [booking]);

  const EmptyState = ({ message }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
        opacity: 0.7,
      }}
    >
      <img
        src="images/nohistory.png"
        alt="No History"
        style={{
          width: "120px",
          marginBottom: "16px",
          filter: "grayscale(100%)",
        }}
      />
      <Typography
        className="NotoSansThai"
        sx={{ color: "#999", fontSize: "16px", fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#F6F6F6",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {loading && <Loading />}

      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#FFF",
          color: "#000",
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography
            className="NotoSansThai"
            sx={{
              fontWeight: 700,
              fontSize: "18px",
              color: "#333",
            }}
          >
            รายการนัดหมาย
          </Typography>
        </Toolbar>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: "48px",
            "& .MuiTab-root": {
              fontFamily: "Noto Sans Thai",
              fontWeight: 600,
              fontSize: "15px",
              textTransform: "none",
              color: "#999",
              "&.Mui-selected": {
                color: "#461E99",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#461E99",
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab label={`นัดหมายเร็วๆ นี้ (${upcomingBookings.length})`} />
          <Tab label="ประวัติย้อนหลัง" />
        </Tabs>
      </AppBar>

      {/* Content */}
      <Container maxWidth="sm" sx={{ p: 0 }}>
        <TabPanel value={tabIndex} index={0}>
          <Box sx={{ px: 2 }}>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <AppointmentCard
                  key={b.id}
                  booking={b}
                  user={user}
                  navigate={navigate}
                />
              ))
            ) : (
              <EmptyState message="ไม่มีรายการนัดหมายเร็วๆ นี้" />
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Box sx={{ px: 2 }}>
            {pastBookings.length > 0 ? (
              pastBookings.map((b) => (
                <AppointmentCard
                  key={b.id}
                  booking={b}
                  user={user}
                  navigate={navigate}
                />
              ))
            ) : (
              <EmptyState message="ไม่พบประวัติการนัดหมาย" />
            )}
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
}
