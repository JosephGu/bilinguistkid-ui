"use client";

import {
  Dialog,
  DialogTitle,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function Profile({ open }: { open: boolean }) {
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState(dayjs("2020-01-01"));
  const [gender, setGender] = useState("");

  const updateProfile = async () => {
    const res = await fetch("/api/v1/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        birthday,
        gender,
      }),
    });

    const data = await res.json();
    if (data.code === 200) {
      alert("更新成功");
    } else {
      alert("更新失败");
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>个人信息</DialogTitle>

      <Box component="form" sx={{ padding: "10px 30px" }}>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label="宝宝昵称"
            sx={{ width: "100%" }}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="宝宝出生年月"
            defaultValue={dayjs('2020-01-01')}
            views={['year', 'month', 'day']}
            sx={{ width: "100%" }}
            value={dayjs(birthday)}
            onChange={(newValue) => newValue && setBirthday(newValue)}

          />
          </LocalizationProvider> */}
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <Select
            label="宝宝性别"
            sx={{ width: "100%" }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="Male">男</MenuItem>
            <MenuItem value="Femail">女</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box
        sx={{ padding: "10px 0" }}
        display={"flex"}
        justifyContent={"center"}
      >
        <Button onClick={() => updateProfile()} variant="contained">
          更改
        </Button>
      </Box>
    </Dialog>
  );
}

export default Profile;
