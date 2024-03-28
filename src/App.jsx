import React, { useState, useEffect } from 'react';
import 'App.css';
import "assets/css/notosansthai.css";
import "assets/css/kanit.css";
import Layout from 'components/layouts/main';
import { LoginPage } from 'components/pages/login';
import { OtpPage } from 'components/pages/otp';
import { TermsPage } from 'components/pages/terms';
import { HomePage } from 'components/pages/home';
import { AppointmentPage } from 'components/pages/appointment';
import { HistoryPage } from 'components/pages/history';
import { AccountPage } from 'components/pages/account';
import { QuestionPage } from 'components/pages/question';
import { LoadPage } from 'components/pages/load';
import { UpdatePage } from 'components/pages/update';
import { LayoutBottomNav } from 'components/layouts/bottomnav';
import { MeetPage } from 'components/pages/meet';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { ConfirmPage } from 'components/pages/confirm';
import { PersonalInformationForm } from 'components/pages/personal-information-form';
import { ViewPage } from 'components/pages/view';
function App() {
  ReactSession.setStoreType("localStorage");

  return (
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
        <Route path="/form" element={<PersonalInformationForm />} />
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
  );
}

export default App;