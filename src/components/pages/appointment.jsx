import React, { useState, useEffect, useMemo } from "react";
import {
  Stack,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
  Container,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
} from "@mui/material";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Link, useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { ReactSession } from "react-client-session";
import api from "../../utils/api";
import { orgId } from "../../configs/app";
import Loading from "../parts/loading";

// Helper for Thai days
const dayMap = {
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
  sunday: "อาทิตย์",
};

const dayColorMap = {
  monday: "#FFD700", // Yellow
  tuesday: "#FF69B4", // Pink
  wednesday: "#008000", // Green
  thursday: "#FF8C00", // Orange
  friday: "#00BFFF", // Blue
  saturday: "#800080", // Purple
  sunday: "#FF0000", // Red
};

const dayKeyMap = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function AppointmentPage() {
  const { expertID: specialistId } = useParams();
  const navigate = useNavigate();
  const [user] = useState(ReactSession.get("user"));
  const [loading, setLoading] = useState(true);
  const [specialist, setSpecialist] = useState(null);

  // Booking State
  const [bookingDate, setBookingDate] = useState(dayjs());
  const [bookingTime, setBookingTime] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Compute available time range for the selected date
  const availableTimeRange = useMemo(() => {
    if (!specialist?.schedule?.weekly || !bookingDate) return null;
    const dayKey = dayKeyMap[bookingDate.day()];
    const slot = specialist.schedule.weekly[dayKey];

    if (!slot || !slot.active) return null;

    const [startH, startM] = slot.start.split(":").map(Number);
    const [endH, endM] = slot.end.split(":").map(Number);

    // Create dayjs objects for min and max time on the selected booking date
    const minTime = bookingDate.hour(startH).minute(startM);
    const maxTime = bookingDate.hour(endH).minute(endM);

    return { minTime, maxTime };
  }, [bookingDate, specialist]);

  // Set initial time when date changes or when drawing opens if not set
  useEffect(() => {
    if (
      availableTimeRange &&
      (!bookingTime || !bookingTime.isSame(bookingDate, "day"))
    ) {
      // Default to start time if current time is invalid for the new date
      setBookingTime(availableTimeRange.minTime);
    }
  }, [availableTimeRange, bookingDate]);

  const shouldDisableDate = (date) => {
    if (!specialist?.schedule?.weekly) return false;
    const dayKey = dayKeyMap[date.day()];
    const slot = specialist.schedule.weekly[dayKey];
    // Disable if no slot configuration or not active
    return !slot || !slot.active;
  };

  useEffect(() => {
    if (!user?.birthday) {
      navigate("/form", { state: { sid: specialistId } });
      return;
    }
    fetchSpecialistData();
  }, [specialistId, user, navigate]);

  const fetchSpecialistData = async () => {
    try {
      const response = await api.get(`/api/specialist/${specialistId}`);
      const data = response.data?.data;

      let parsedSchedule = null;
      try {
        if (data.schedule_appointments) {
          parsedSchedule = JSON.parse(data.schedule_appointments);
        }
      } catch (e) {
        console.error("Failed to parse schedule:", e);
      }

      setSpecialist({
        ...data,
        schedule: parsedSchedule,
      });
    } catch (error) {
      console.error("Error fetching specialist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    try {
      const submitData = {
        organization_id: orgId,
        user_id: user.id,
        specialist_id: specialistId,
        appointment_date: bookingDate.format("YYYY-MM-DD"),
        appointment_time: bookingTime ? bookingTime.format("HH:mm") : "",
      };

      await api.post("/api/appointment", submitData);
      setDrawerOpen(false);
      navigate("/confirm", {
        state: {
          booking: {
            specialistId,
            bookingDate,
            bookingTime,
          },
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      // Ensure error handling or alert here
    }
  };

  const SectionHeader = ({ icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" mb={2} mt={1}>
      <Box
        sx={{
          backgroundColor: "#EFE9F5",
          borderRadius: "50%",
          p: 0.8,
          display: "flex",
        }}
      >
        {icon}
      </Box>
      <Typography
        className="NotoSansThai"
        sx={{ fontWeight: 700, fontSize: "16px", color: "#333" }}
      >
        {title}
      </Typography>
    </Stack>
  );

  const InfoList = ({ text }) => {
    if (!text) return null;
    const items = text.split("\n").filter((i) => i.trim() !== "");
    return (
      <Box sx={{ pl: 1 }}>
        {items.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="start"
            mb={1}
          >
            <Box
              sx={{
                minWidth: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#461E99",
                marginTop: "10px !important",
              }}
            />
            <Typography
              className="NotoSansThai"
              sx={{ fontSize: "14px", color: "#555", lineHeight: 1.6 }}
            >
              {item.replace(/^-/, "").trim()}
            </Typography>
          </Stack>
        ))}
      </Box>
    );
  };

  if (loading) return <Loading />;
  if (!specialist)
    return (
      <Box p={4}>
        <Typography>Specialist not found</Typography>
      </Box>
    );

  return (
    <Box sx={{ backgroundColor: "#F6F6F6", minHeight: "100vh", pb: 10 }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#FFF",
          color: "#000",
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIosNewOutlinedIcon />
          </IconButton>
          <Typography
            className="NotoSansThai"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: 700,
              fontSize: "18px",
              mr: 5, // offset for back button to center title
            }}
          >
            รายละเอียดผู้เชี่ยวชาญ
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ p: 2 }}>
        {/* Profile Header */}
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            mb: 2,
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              src={specialist.profile_pic_file_name}
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                mb: 2,
                border: "4px solid #fff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Typography
              className="NotoSansThai"
              sx={{ fontWeight: 700, fontSize: "18px", color: "#333" }}
            >
              {specialist.prefix} {specialist.firstname} {specialist.lastname}
            </Typography>
            <Typography
              className="NotoSansThai"
              sx={{ fontSize: "14px", color: "#666", mb: 2 }}
            >
              {specialist.type_name}
            </Typography>

            {/* Topics */}
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 2 }}
            >
              {specialist.topics_json?.map((topic, i) => {
                // Check if topic is object (new format) or just ID string (old format fallback)
                // The user provided full response data shows objects.
                if (typeof topic === "object" && topic !== null) {
                  return (
                    <Chip
                      key={topic.id || i}
                      label={topic.name}
                      avatar={
                        <Avatar alt={topic.name} src={topic.icon_file_name} />
                      }
                      variant="outlined"
                      sx={{
                        fontFamily: "Noto Sans Thai",
                        backgroundColor: "#FAFAFA",
                        borderColor: "#EEE",
                        height: "36px",
                        "& .MuiChip-label": {
                          fontSize: "13px",
                          color: "#444",
                          fontWeight: 500,
                        },
                        "& .MuiChip-avatar": {
                          width: 24,
                          height: 24,
                        },
                      }}
                    />
                  );
                }
                return null;
              })}
            </Stack>

            {specialist.is_active === 1 && (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
                label="พร้อมให้บริการ"
                color="success"
                size="small"
                sx={{
                  mt: 1,
                  fontFamily: "NotoSansThai",
                  fontWeight: 600,
                  bgcolor: "#E8F5E9",
                  color: "#2E7D32",
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Education & Work */}
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.03)",
            mb: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={<SchoolIcon sx={{ color: "#461E99", fontSize: 20 }} />}
              title="ประวัติการศึกษา"
            />
            <InfoList text={specialist.education_record} />

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            <SectionHeader
              icon={<WorkIcon sx={{ color: "#461E99", fontSize: 20 }} />}
              title="ประวัติการทำงาน"
            />
            <InfoList text={specialist.work_history} />
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.03)",
            mb: 10,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <SectionHeader
              icon={
                <CalendarMonthIcon sx={{ color: "#461E99", fontSize: 20 }} />
              }
              title="ตารางเวลาออกตรวจ"
            />
            {specialist.schedule?.weekly && (
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {Object.entries(specialist.schedule.weekly).map(
                  ([dayKey, slot]) => {
                    if (!slot.active) return null;
                    return (
                      <Grid item xs={12} key={dayKey}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            p: 1.5,
                            borderRadius: "10px",
                            backgroundColor: "#FAFAFA",
                            border: "1px solid #F0F0F0",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: dayColorMap[dayKey],
                              }}
                            />
                            <Typography
                              className="NotoSansThai"
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#333",
                              }}
                            >
                              {dayMap[dayKey]}
                            </Typography>
                          </Stack>
                          <Typography
                            className="NotoSansThai"
                            sx={{ fontSize: "14px", color: "#666" }}
                          >
                            {slot.start} - {slot.end}
                          </Typography>
                        </Stack>
                      </Grid>
                    );
                  },
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Floating Action Button / Bottom Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: "#fff",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          zIndex: 100,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => setDrawerOpen(true)}
          disabled={specialist.is_active === 0}
          className="NotoSansThai"
          sx={{
            borderRadius: "50px",
            backgroundColor: "#461E99",
            padding: "14px",
            fontSize: "16px",
            fontWeight: 600,
            boxShadow: "0 4px 15px rgba(70, 30, 153, 0.3)",
            "&:disabled": {
              backgroundColor: "#CCC",
            },
          }}
        >
          {specialist.is_active === 1
            ? "จองนัดหมายปรึกษา"
            : "ไม่พร้อมให้บริการ"}
        </Button>
      </Box>

      {/* Booking Drawer */}
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "32px",
            borderTopRightRadius: "32px",
            background: "#fff",
          },
        }}
      >
        <Box sx={{ p: 4, pb: 6 }}>
          <Stack direction="row" justifyContent="center" mb={1}>
            <Box
              sx={{
                width: 60,
                height: 6,
                bgcolor: "#E0E0E0",
                borderRadius: "3px",
              }}
            />
          </Stack>

          <Typography
            className="NotoSansThai"
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              my: 3,
              textAlign: "center",
              color: "#333",
            }}
          >
            เลือกวันและเวลาที่สะดวก
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
            <Box
              sx={{
                bgcolor: "#F9F9F9",
                borderRadius: "24px",
                p: 2,
                mb: 3,
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "#461E99 !important",
                },
                "& .MuiPickersDay-root:focus.Mui-selected": {
                  backgroundColor: "#461E99 !important",
                },
                "& .MuiPickersYear-yearButton.Mui-selected": {
                  backgroundColor: "#461E99 !important",
                  color: "#fff",
                },
              }}
            >
              <DateCalendar
                value={bookingDate}
                onChange={(newValue) => setBookingDate(newValue)}
                disablePast
                shouldDisableDate={shouldDisableDate}
                views={["year", "month", "day"]}
                sx={{ width: "100%" }}
              />
            </Box>

            <Typography
              className="NotoSansThai"
              sx={{ fontWeight: 600, fontSize: "16px", mb: 2, ml: 1 }}
            >
              เลือกเวลา
            </Typography>

            <TimePicker
              value={bookingTime}
              onChange={(newValue) => setBookingTime(newValue)}
              minutesStep={30}
              ampm={false}
              sx={{ width: "100%", mb: 4 }}
              minTime={availableTimeRange?.minTime}
              maxTime={availableTimeRange?.maxTime}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  InputProps: {
                    sx: {
                      borderRadius: "16px",
                      backgroundColor: "#FFF",
                      border: "1px solid #E0E0E0",
                      fontFamily: "NotoSansThai",
                      fontSize: "16px",
                      height: "56px",
                      "&:hover": {
                        borderColor: "#461E99",
                      },
                      "&.Mui-focused": {
                        borderColor: "#461E99",
                        boxShadow: "0 0 0 2px rgba(70, 30, 153, 0.1)",
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            fullWidth
            onClick={handleBookAppointment}
            className="NotoSansThai"
            sx={{
              borderRadius: "50px",
              backgroundColor: "#461E99",
              padding: "16px",
              fontSize: "18px",
              fontWeight: 600,
              boxShadow: "0 8px 20px rgba(70, 30, 153, 0.3)",
              transition: "transform 0.2s",
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            ยืนยันการนัดหมาย
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
