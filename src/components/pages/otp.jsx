import React, { useState, useEffect, Component } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { MuiOtpInput } from "mui-one-time-password-input";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { orgId } from "../../configs/app";
import api from "../../utils/api";
import { ReactSession } from "react-client-session";
import Loading from "components/parts/loading";

export function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState();
  const [otp, setOtp] = useState("");
  const [ref, setRef] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [validate, setValidate] = useState(true);

  useEffect(() => {
    if (ref === "") {
      setRef("Loading...");
      requestOTP();
    }
  }, [0]);

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const requestOTP = async () => {
    await setIsLoading(true);
    await setOtp("");
    await setValidate(true);

    let tempUser = localStorage.getItem("email") || location.state.userEmail;
    setEmail(tempUser);

    let Ref = localStorage.getItem("ref") || "";
    if (Ref !== "") {
      await setRef(Ref);
      setIsLoading(false);
      return;
    }

    try {
      let requestOtp = await api.post("/api/user-create-otp", {
        user_email: tempUser,
      });
      let newRef = requestOtp.data.data;
      if (requestOtp.data.status === 201) {
        await setRef(newRef.ref_num);
        await localStorage.setItem("ref", newRef.ref_num);
      }
    } catch (error) {
      console.log("เกิดข้อผิดพลาด ในการส่ง OTP กรุณาลองใหม่อีกครั้งในภายหลัง");
    }
    setIsLoading(false);
  };

  const handleComplete = (finalValue) => {
    // console.log(finalValue)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let verifyOtp = await api.post("/api/user-verify-otp", {
        otp_num: otp,
        ref_num: ref,
        user_email: email,
      });

      if (verifyOtp.data.status === 200) {
        await localStorage.removeItem("ref");
        if (verifyOtp.data.token) {
          localStorage.setItem("access_token", verifyOtp.data.token);
        }
        await createUser();
        // navigate('/terms');
      }
    } catch (error) {
      console.error(error);
      setValidate(false);
    }
  };

  const createUser = async () => {
    try {
      // organization_id is now handled by the X-Organization-ID header in api utils
      // kept here for backward compatibility if needed, but header is primary
      let response = await api.post("/api/user", {
        email: email,
        organization_id: orgId,
      });
      response = response.data.data;
      if (response != null) {
        await ReactSession.set("user", response);
        if (response.is_pdpa_accepted == 1) {
          // console.log('redirect to home', response);
          navigate("/home");
        } else {
          // console.log('redirect to term', response);
          navigate("/terms");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const matchIsNumeric = (text) => {
    // regular expression to check is text is number
    const re = /^[0-9\b]+$/;
    if (text === "" || re.test(text)) {
      return true;
    }
  };

  const validateChar = (value, index) => {
    return matchIsNumeric(value);
  };

  return (
    <Box
      component="form"
      sx={{
        height: "100vh",
        px: 3,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {isLoading && <Loading />}
      <AppBar
        position="relative"
        sx={{
          backgroundColor: "#FFF",
          color: "#000",
          boxShadow: "unset",
          paddingTop: "10px",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, position: "absolute" }}
            component={Link}
            to="/login"
          >
            <ArrowBackIosNewOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
        spacing={2}
      >
        <div style={{ marginBottom: "40px" }}>
          <Typography
            variant="h4"
            className="NotoSansThai text-center fw-600"
            style={{ marginBottom: "10px" }}
          >
            ใส่รหัสยืนยัน
          </Typography>
          <div className="text-center">
            กรุณาใส่รหัสยืนยันที่ถูกส่งไปยังอีเมล
          </div>
          <div className="text-center">
            {email} | Ref: {ref}
          </div>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <MuiOtpInput
            value={otp}
            onChange={handleChange}
            TextFieldsProps={{
              type: "tel",
              maxLength: 1,
            }}
            autoFocus
            validateChar={validateChar}
            onComplete={handleComplete}
          />
          {!validate ? (
            <FormHelperText
              sx={{ color: "red", textAlign: "center", marginTop: "15px" }}
            >
              รหัสยืนยันไม่ถูกต้อง
            </FormHelperText>
          ) : null}
        </div>

        <div style={{ marginBottom: "30px" }}>
          <Button
            variant="text"
            className="NotoSansThai"
            sx={{
              fontSize: "18px",
              textDecoration: "underline",
              color: "#461E99",
            }}
          >
            <Link sx={{ mr: 2 }} onClick={requestOTP}>
              {" "}
              ส่งรหัสยืนยันอีกครั้ง{" "}
            </Link>
          </Button>
        </div>

        <Button
          variant="contained"
          className="NotoSansThai"
          type="submit"
          sx={{
            borderRadius: 50,
            backgroundColor: "#461E99",
            padding: "10px 32px",
            fontSize: "18px",
            width: "50%",
          }}
        >
          ยืนยัน
        </Button>
      </Stack>
    </Box>
  );
}
