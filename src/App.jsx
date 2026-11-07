import React, { useState, useEffect } from "react";
import "App.css";
import "assets/css/notosansthai.css";
import "assets/css/kanit.css";
import Box from "@mui/material/Box";
import Layout from "components/layouts/main";
import { LoginPage } from "components/pages/login";
import { OtpPage } from "components/pages/otp";
import { TermsPage } from "components/pages/terms";
import { HomePage } from "components/pages/home";
import { AppointmentPage } from "components/pages/appointment";
import { HistoryPage } from "components/pages/history";
import { AccountPage } from "components/pages/account";
import { QuestionPage } from "components/pages/question";
import { LoadPage } from "components/pages/load";
import { UpdatePage } from "components/pages/update";
import { LayoutBottomNav } from "components/layouts/bottomnav";
import { MeetPage } from "components/pages/meet";
import { SuspendedPage } from "components/pages/suspended";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactSession } from "react-client-session";
import { ConfirmPage } from "components/pages/confirm";
import { FormPage as AssesmentForm } from "components/pages/form";
import { ViewPage } from "components/pages/view";
import api from "utils/api";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationBanner from "./components/parts/NotificationBanner";
import Chat from "components/pages/chat";
import ChatBadge from "components/parts/ChatBadge";

function App() {
  ReactSession.setStoreType("localStorage");
  const [orgStatus, setOrgStatus] = useState("loading"); // "loading" | "active" | "disabled" | "not_found"
  const [orgMessage, setOrgMessage] = useState("");

  useEffect(() => {
    const handleOrgDisabled = (event) => {
      setOrgStatus("disabled");
      if (event?.detail?.message) {
        setOrgMessage(event.detail.message);
      }
    };

    window.addEventListener("org-disabled", handleOrgDisabled);

    const fetchOrgSettings = async () => {
      try {
        // Fetch organization settings to verify active status
        const response = await api.get(
          `/api/organization/data?includes=info,organization_specialist_type,segments,locations`,
        );

        if (response.data && response.data.data) {
          const orgSettings = response.data.data;
          const today = new Date().toISOString().split("T")[0];
          localStorage.setItem(
            "organization_settings",
            JSON.stringify(orgSettings),
          );
          localStorage.setItem("org_settings_last_update", today);
          ReactSession.set("organization_settings", orgSettings);

          if (
            orgSettings.organization_information &&
            orgSettings.organization_information.name
          ) {
            document.title = orgSettings.organization_information.name;
          }
          setOrgStatus("active");
        } else {
          setOrgStatus("active");
        }
      } catch (error) {
        console.error("Failed to fetch organization settings:", error);
        if (
          error.response?.status === 403 ||
          error.response?.data?.error === "ORG_DISABLED"
        ) {
          localStorage.removeItem("organization_settings");
          localStorage.removeItem("org_settings_last_update");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setOrgStatus("disabled");
          setOrgMessage(
            error.response?.data?.message ||
              "ระบบขององค์กรนี้ถูกระงับการใช้งานชั่วคราว",
          );
        } else if (
          error.response?.status === 404 ||
          error.response?.data?.error === "ORG_NOT_FOUND"
        ) {
          localStorage.removeItem("organization_settings");
          localStorage.removeItem("org_settings_last_update");
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setOrgStatus("not_found");
        } else {
          // Fallback if network offline but has existing settings
          const existingSettings = localStorage.getItem("organization_settings");
          if (existingSettings && !error.response) {
            setOrgStatus("active");
          } else {
            setOrgStatus("disabled");
          }
        }
      }
    };

    fetchOrgSettings();

    return () => {
      window.removeEventListener("org-disabled", handleOrgDisabled);
    };
  }, []);

  if (orgStatus === "loading") {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#F4F3FE",
        }}
      >
        <Box
          component="img"
          sx={{ width: 140, mb: 2 }}
          src="/images/logo3.png"
          alt="Logo"
        />
        <Box sx={{ fontSize: "14px", color: "#666" }}>กำลังโหลดข้อมูล...</Box>
      </Box>
    );
  }

  if (orgStatus === "disabled") {
    return <SuspendedPage message={orgMessage} />;
  }

  if (orgStatus === "not_found") {
    return <SuspendedPage isNotFound={true} />;
  }

  return (
    <NotificationProvider>
      <NotificationBanner />
      <Chat />
      <ChatBadge />
      <Routes>
        /** Layout main */
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<LoadPage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/view" element={<ViewPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/appointment/:expertID" element={<AppointmentPage />} />
          <Route path="/question" element={<QuestionPage />} />
          <Route path="/form" element={<AssesmentForm />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/meet" element={<MeetPage />} />
          /** *** Layout bottom */
          <Route path="/" element={<LayoutBottomNav />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Route>
      </Routes>
    </NotificationProvider>
  );
}

export default App;
