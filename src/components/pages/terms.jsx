import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { ReactSession } from "react-client-session";
import { BrowserRouter as Router, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

export function TermsPage() {
  const [is_accept_terms, setIsAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(ReactSession.get("user"));

  useEffect(() => {
    setIsAcceptTerms(false);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newUser = user;
    newUser = { ...user, is_pdpa_accepted: "1" };
    await setUser(newUser);
    // update user to server
    await ReactSession.set("user", newUser);
    // axios api to update user
    let updateInfo = await api.put("/api/user/" + user.id, newUser);
    // get user from api
    let getUser = await api.get("/api/user/" + user.id);
    // set user
    // await setUser(getUser.data.data);
    // navigate to home page
    navigate("/home");
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
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
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, position: "absolute" }}
            component={Link}
            to="/login"
          >
            <ArrowBackIosNewOutlinedIcon />
          </IconButton>

          <Typography
            className="NotoSansThai"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            เงื่อนไขและข้อตกลงในการใช้บริการ
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: 3, py: 2, height: "auto" }}>
        <div className="texts1">
          การใช้ช่องทางการให้บริการของ Synz อยู่ภายใต้เงื่อนไขว่า
          คุณตกลงยอมรับข้อตกลงและเงื่อนไขการใช้บริการต่าง ๆ ที่กำหนดไว้
          การใช้ช่องทางการให้บริการของ Synz การใช้ช่องทางการให้บริการของ Synz
          อยู่ภายใต้เงื่อนไขว่า คุณตกลงยอมรับข้อตกลงและเงื่อนไขการใช้บริการต่าง
          ๆ ที่กำหนดไว้ การใช้ช่องทางการให้บริการของ Synz ของคุณ
          ย่อมก่อให้เกิดความผูกพันและสัญญาตามกฎหมายดังระบุ
          ข้อตกลงและเงื่อนไขการใช้บริการทั้งหมด ซึ่งคุณได้อ่านและ
          ทำความเข้าใจในข้อตกลงและเงื่อนไขการใช้บริการแล้ว
          คุณยอมรับและตกลงที่จะผูกพันกับข้อตกลงและเงื่อนไขการใช้บริการเหล่านี้
        </div>
        <div className="texts1">
          หากคุณไม่ยอมรับหรือไม่สามารถปฏิบัติตามข้อตกลง
          และเงื่อนไขการใช้บริการนี้ คุณจะไม่สามารถใช้งานช่องทางการ ให้บริการของ
          Synz หรือเข้าถึงเนื้อหาใด ๆ ได้ ของคุณ
          ย่อมก่อให้เกิดความผูกพันและสัญญาตามกฎหมายดังระบุข้อ
          ตกลงและเงื่อนไขการใช้บริการทั้งหมด ซึ่งคุณได้อ่านและ
          ทำความเข้าใจในข้อตกลงและเงื่อนไขการใช้บริการแล้ว
          คุณยอมรับและตกลงที่จะผูกพันกับข้อตกลงและเงื่อนไขการใช้บริการเหล่านี้
        </div>
      </Box>
      <Box sx={{ px: 3, py: 2, height: "auto" }}>
        <Link
          target="_blank"
          rel="noopener"
          onClick={() =>
            (window.location.href = "https://synz-webbase.nsdneuron.com/terms/")
          }
        >
          Term and Conditions
        </Link>
      </Box>
      <Box sx={{ px: 3, py: 2, height: "auto" }}>
        <Link
          target="_blank"
          rel="noopener"
          onClick={() =>
            (window.location.href =
              "https://synz-webbase.nsdneuron.com/privacy-policy/")
          }
        >
          Privacy Policy
        </Link>
      </Box>

      <Box
        component="form"
        sx={{
          height: "10vh",
          px: 3,
          mt: 10,
        }}
        noValidate
        autoComplete="off"
      >
        <Button
          variant="contained"
          className="NotoSansThai"
          type="submit"
          fullWidth
          onClick={handleSubmit}
          sx={{
            borderRadius: 50,
            backgroundColor: "#461E99",
            padding: "10px 32px",
            fontSize: "18px",
            width: "100%",
          }}
        >
          ยอมรับ
        </Button>
      </Box>
    </Box>
  );
}
