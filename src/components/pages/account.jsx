import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import api from "../../utils/api";
import Chat from "./chat";
export function AccountPage() {
  const [user, setUser] = useState(
    ReactSession.get("user") ||
      JSON.parse(localStorage.getItem("user")) || {
        firstname: "",
        lastname: "",
        email: "",
        phone_number: "",
        attribute_1: "",
        attribute_2: "",
        age_range: "",
      },
  );
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (user && user.id) {
      getUserData(user.id);
    }
  }, []);

  const getUserData = async (userId) => {
    try {
      const res = await api.get(`/api/user/${userId}`);
      if (res.data && res.data.data) {
        setUser(res.data.data);
        ReactSession.set("user", res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };
  const [snackbar, setSnackBar] = React.useState(false);
  const version = "2.0.0";

  const handleSubmit = async (e) => {
    // validate all input is not empty
    e.preventDefault();
    try {
      // update user to server
      await api.put("/api/user/" + user.id, user);
      await ReactSession.set("user", user);
      await localStorage.setItem("user", JSON.stringify(user));
      await setSnackBar(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [openLogout, setOpenLogout] = React.useState(false);

  const handleLogoutClick = () => {
    setOpenLogout(true);
  };

  const handleLogoutClose = () => {
    setOpenLogout(false);
  };

  const performLogout = async () => {
    setOpenLogout(false);
    await ReactSession.remove("user");
    await localStorage.removeItem("user");
    await localStorage.removeItem("specialist_type_1");
    await localStorage.removeItem("specialist_type_2");
    await localStorage.removeItem("banners");
    await localStorage.removeItem("email");
    await localStorage.removeItem("ref");
    await localStorage.removeItem("last_update");
    // await window.$chatwoot.reset();
    // await window.$chatwoot.toggleBubbleVisibility("hide");
    navigate("/login");
  };
  return (
    <Box sx={{ backgroundColor: "#FFF", paddingBottom: "80px" }}>
      <Chat />
      <Box component="form" autoComplete="off" onSubmit={handleSubmit} pt={5}>
        <Stack sx={{ mx: 3 }} spacing={4}>
          <TextField
            label="ชื่อ"
            required={true}
            variant="standard"
            value={user.firstname}
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
          />
          <TextField
            label="นามสกุล"
            required={true}
            variant="standard"
            value={user.lastname}
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
          />
          <TextField
            label="อีเมล"
            required={true}
            variant="standard"
            value={user.email}
            disabled
          />
          <TextField
            label="เบอร์โทร"
            required={true}
            variant="standard"
            value={user.phone_number}
            onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
            inputProps={{ maxLength: 10, pattern: "[0-9]{10}" }}
            type="tel"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl variant="standard" fullWidth>
            <InputLabel id="age-range-label">ช่วงอายุ</InputLabel>
            <Select
              labelId="age-range-label"
              id="age-range-select"
              value={user.age_range || ""}
              onChange={(e) => setUser({ ...user, age_range: e.target.value })}
              label="ช่วงอายุ"
            >
              {["20-30", "31-40", "41-50", "51-60"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="องค์กร"
            variant="standard"
            value={
              JSON.parse(localStorage.getItem("organization_settings"))
                ?.organization_information?.name || user.attribute_1
            }
            disabled
          />

          <FormControl variant="standard" fullWidth>
            <InputLabel id="segment-label">แผนก/สังกัด</InputLabel>
            <Select
              labelId="segment-label"
              id="segment-select"
              value={user.attribute_2 || ""}
              onChange={(e) =>
                setUser({ ...user, attribute_2: e.target.value })
              }
              label="แผนก/สังกัด"
            >
              {JSON.parse(
                localStorage.getItem("organization_settings"),
              )?.company_segments?.map((segment) => (
                <MenuItem key={segment.id} value={segment.segment_name}>
                  {segment.segment_name}
                </MenuItem>
              )) || (
                <MenuItem value={user.attribute_2}>{user.attribute_2}</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <InputLabel id="work-location-label">สถานที่ปฏิบัติงาน</InputLabel>
            <Select
              labelId="work-location-label"
              id="work-location-select"
              value={user.attribute_1 || ""}
              onChange={(e) =>
                setUser({ ...user, attribute_1: e.target.value })
              }
              label="สถานที่ปฏิบัติงาน"
            >
              {JSON.parse(
                localStorage.getItem("organization_settings"),
              )?.organization_locations?.map(
                (location) => (
                  <MenuItem
                    key={location.id || location.name}
                    value={location.name}
                  >
                    {location.name}
                  </MenuItem>
                ),
              ) || (
                <MenuItem value={user.attribute_1}>{user.attribute_1}</MenuItem>
              )}
            </Select>
          </FormControl>

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
            บันทึกข้อมูล
          </Button>
          <Button
            variant="contained"
            type="button"
            onClick={() => {
              navigate("/form");
            }}
            fullWidth
            className="NotoSansThai secondaryButton"
            sx={{
              borderRadius: 50,
              backgroundColor: "#F6F6F6",
              padding: "16px 32px",
              fontSize: "16px",
              color: "#656565",
              boxShadow: "unset",
            }}
          >
            แก้ไขข้อมูลอื่นๆ
          </Button>
          <Stack sx={{ mx: 3 }} spacing={3} direction={"row"}>
            <Button
              variant="contained"
              type="button"
              fullWidth
              className="NotoSansThai secondaryButton"
              onClick={handleClickOpen}
              sx={{
                borderRadius: 50,
                backgroundColor: "#F6F6F6",
                padding: "16px 32px",
                fontSize: "16px",
                color: "#656565",
                boxShadow: "unset",
              }}
            >
              ยกเลิกสมาชิก
            </Button>
            <Button
              variant="contained"
              type="button"
              fullWidth
              className="NotoSansThai secondaryButton"
              sx={{
                borderRadius: 50,
                backgroundColor: "#F6F6F6",
                padding: "16px 32px",
                fontSize: "16px",
                color: "#656565",
                boxShadow: "unset",
              }}
              onClick={handleLogoutClick}
            >
              ออกจากระบบ{" "}
            </Button>
          </Stack>
          <Button
            variant="text"
            type="link"
            fullWidth
            color="info"
            size="large"
            className="NotoSansThai"
            href="tel:0949244997"
          >
            Call center 094-924-4997
          </Button>
        </Stack>
        <Typography
          className="NotoSansThai"
          marginTop={3}
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: 400,
            fontSize: 12,
          }}
        >
          Version: {version}
        </Typography>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"ต้องการลบบัญชีผู้ใช้หรือไม่?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณยืนยันที่จะลบบัญชีของคุณ หรือไม่
              หากลบแล้วจะไม่สามารถกู้คืนได้อีกต่อไป และอีเมล์
              หรือเบอร์โทรศัพท์นี้จะไม่สามารถใช้งานได้อีกต่อไป
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="secondary">
              ไม่ต้องการลบ
            </Button>
            <Button onClick={handleClose} autoFocus color="error">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openLogout}
          onClose={handleLogoutClose}
          aria-labelledby="logout-dialog-title"
        >
          <DialogTitle id="logout-dialog-title">
            {"ต้องการออกจากระบบหรือไม่?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณยืนยันที่จะออกจากระบบ หรือไม่
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleLogoutClose} color="secondary">
              ยกเลิก
            </Button>
            <Button onClick={performLogout} autoFocus color="error">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => {
          setSnackBar(false);
        }}
        message="บันทึกเสร็จเรียบร้อย"
      />
    </Box>
  );
}
