import React, { useState, useEffect, Component } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Lock from "@mui/icons-material/Lock";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import Alert from "@mui/material/Alert";
import Chat from "./chat";
import { getOrganizationIdFromUrl } from "../../utils/org-helper";
export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const user = ReactSession.get("user");
    if (user) {
      navigate("/home");
    }
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
    validate(e.target.value);
  };

  /**
   * Validates the given email value using a specific pattern and checks against public domains.
   *
   * @param {string} email_value - The email value to be validated
   * @return {boolean} true if the email value is valid and not a public domain, false otherwise
   */
  const validate = (email_value) => {
    const orgId = getOrganizationIdFromUrl();

    if (orgId === "egat" || orgId === "egat2") {
      const pattern = /^[56]\d{5}@egat\.co\.th$/;
      if (pattern.test(email_value)) {
        setError(false);
        return true;
      } else {
        setError(true);
        return false;
      }
    }

    const publicDomains = [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "yahoo.com",
      "icloud.com",
      "live.com",
      "mail.com",
      "aim.com",
      "aol.com",
    ];

    const domain = email_value.split("@")[1]?.toLowerCase();
    if (publicDomains.includes(domain)) {
      setError(true);
      return false;
    }

    setError(false);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = email;
    localStorage.setItem("email", userEmail);
    if (validate(userEmail)) {
      navigate("/otp", { state: { userEmail } });
    }
  };

  return (
    <Box
      component="form"
      sx={{
        height: "100vh",
        textAlign: "center",
      }}
      noValidate
      autoComplete="off"
      className="bg-login"
      onSubmit={handleSubmit}
    >
      <Chat disabled={true} />
      <Box
        component="img"
        sx={{
          width: "45%",
          mt: "30%",
          mb: "10%",
          mx: "auto",
        }}
        src={
          JSON.parse(localStorage.getItem("organization_settings"))
            ?.organization_information?.icon_url || "/images/logo3.png"
        }
      />
      <Stack sx={{ mx: 3 }} spacing={5}>
        <TextField
          required
          id="outlined-controlled"
          label="กรุณาระบุอีเมลองค์กร"
          value={email}
          placeholder="กรอกอีเมล"
          sx={{ mb: 3 }}
          type="email"
          inputProps={{ style: { fontSize: 18 }, type: "email" }}
          onChange={handleChange}
          error={error}
        />
        {error ? (
          <div style={{ fontSize: "12px", textAlign: "left" }}>
            <Alert severity="warning">
              <b>อีเมลไม่ถูกต้อง เงื่อนไขในการใช้บริการ</b>
              <br />
              ต้องใช้ Email ที่ออกโดยองค์กรที่ทำงานอยู่เท่านั้น
              <br />
            </Alert>
          </div>
        ) : null}

        <Button
          variant="contained"
          type="submit"
          fullWidth
          className="NotoSansThai"
          sx={{
            borderRadius: 50,
            backgroundColor: "#461E99",
            padding: "16px 32px",
            fontSize: "16px",
          }}
        >
          ถัดไป <ArrowForwardOutlinedIcon sx={{ ml: 2 }} />{" "}
        </Button>

        <div
          style={{
            fontSize: "14px",
            textAlign: "center",
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lock className="w-3 h-3 mr-1" /> Protected by SynZ Security
        </div>
      </Stack>
    </Box>
  );
}
