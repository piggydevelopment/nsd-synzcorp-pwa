import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";

export function SuspendedPage({ message, isNotFound }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        textAlign: "center",
        backgroundColor: "#F4F3FE",
      }}
    >
      <Box
        component="img"
        src="/images/logo3.png"
        alt="Logo"
        sx={{
          width: 140,
          mb: 4,
          opacity: 0.85,
        }}
      />
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          p: 4,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 8px 24px rgba(70, 30, 153, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#FEE2E2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <BlockIcon sx={{ fontSize: 40, color: "#DC2626" }} />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#1F2937",
            mb: 1.5,
            fontFamily: "Kanit, sans-serif",
          }}
        >
          {isNotFound ? "ไม่พบข้อมูลองค์กรนี้" : "ระบบปิดให้บริการชั่วคราว"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
            mb: 3,
            lineHeight: 1.6,
            fontFamily: "Noto Sans Thai, sans-serif",
          }}
        >
          {message ||
            (isNotFound
              ? "ไม่พบองค์กรที่ระบุในระบบ กรุณาตรวจสอบ URL หรือติดต่อผู้ดูแลระบบ"
              : "ระบบขององค์กรนี้ถูกระงับการใช้งานชั่วคราว หากมีข้อสงสัยหรือต้องการสอบถามข้อมูล กรุณาติดต่อฝ่ายทรัพยากรบุคคล (HR) หรือผู้ดูแลระบบขององค์กรท่าน")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{
            backgroundColor: "#461e99",
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Kanit, sans-serif",
            "&:hover": {
              backgroundColor: "#361678",
            },
          }}
        >
          ลองใหม่อีกครั้ง
        </Button>
      </Box>
    </Box>
  );
}

export default SuspendedPage;
