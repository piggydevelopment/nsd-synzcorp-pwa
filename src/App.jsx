import React, { useState, useEffect } from "react";
import "App.css";
import "assets/css/notosansthai.css";
import "assets/css/kanit.css";
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

  useEffect(() => {
    const fetchOrgSettings = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const lastUpdate = localStorage.getItem("org_settings_last_update");
        const existingSettings = localStorage.getItem("organization_settings");

        if (existingSettings && lastUpdate === today) {
          const orgSettings = JSON.parse(existingSettings);
          ReactSession.set("organization_settings", orgSettings);
          if (
            orgSettings.organization_information &&
            orgSettings.organization_information.name
          ) {
            document.title = orgSettings.organization_information.name;
          }
          return;
        }

        // Fetch organization settings
        const response = await api.get(
          `/api/organization/data?includes=info,organization_specialist_type,segments,locations`,
        );

        if (response.data && response.data.data) {
          const orgSettings = response.data.data;
          localStorage.setItem(
            "organization_settings",
            JSON.stringify(orgSettings),
          );
          localStorage.setItem("org_settings_last_update", today);
          ReactSession.set("organization_settings", orgSettings);

          // Optional: Set document title if name is available
          if (
            orgSettings.organization_information &&
            orgSettings.organization_information.name
          ) {
            document.title = orgSettings.organization_information.name;
          }
        }
      } catch (error) {
        console.error("Failed to fetch organization settings:", error);
      }
    };

    fetchOrgSettings();
  }, []);

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
