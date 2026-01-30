import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import api from "../../utils/api";
export function UpdatePage() {
  const [area, setArea] = useState("");
  const [department, setDepartment] = useState("");
  const [user, setUser] = useState(ReactSession.get("user"));
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    // validate all input is not empty
    e.preventDefault();
    try {
      // update user to server
      await api.put("/api/user/" + user.id, user);
      await ReactSession.set("user", user);
      await localStorage.setItem("user", JSON.stringify(user));
      await setOpen(true);
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.log(error);
      alert(
        "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง" +
          "\n" +
          error.response.data.message,
      );
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <Box sx={{ backgroundColor: "#FFF", paddingBottom: "80px" }}>
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
            อัพเดทข้อมูลบัญชีผู้ใช้
          </Typography>
        </Toolbar>
      </AppBar>

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
            <InputLabel id="segment-label">แผนก / สังกัด</InputLabel>
            <Select
              labelId="segment-label"
              id="segment-select"
              value={user.attribute_2 || ""}
              onChange={(e) =>
                setUser({ ...user, attribute_2: e.target.value })
              }
              label="แผนก / สังกัด"
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
              )?.organization_locations?.map((location) => (
                <MenuItem
                  key={location.id || location.name}
                  value={location.name}
                >
                  {location.name}
                </MenuItem>
              )) || (
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
        </Stack>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message="บันทึกเสร็จเรียบร้อย"
        />
      </Box>
    </Box>
  );
}
