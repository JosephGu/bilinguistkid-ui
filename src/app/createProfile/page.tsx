"use client";

import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
} from "@mui/material";
import { useState } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";

function CreateProfile() {
  const [nickname, setnickname] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");

  const updateProfile = async () => {
    // 为一位数的月份和日期添加前导0
    const formattedMonth =
      month && month.toString().length === 1 ? `0${month}` : month;
    const formattedDate =
      date && date.toString().length === 1 ? `0${date}` : date;

    const res = await fetch("/api/v1/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        birthday: `${year}-${formattedMonth}-${formattedDate}`,
        gender,
      }),
    });

    const data = await res.json();
    if (data.code === 200) {
      alert("Profile updated successfully");
      redirect("/");
    } else {
      alert("Update profile failed" + data.message);
    }
  };

  return (
    <>
      <Image
        src="/bg2160.webp"
        alt="image"
        width={1920}
        height={1042}
        layout="responsive"
      />
      <Dialog open fullWidth>
        <Box component="form" sx={{ padding: "10px 30px" }}>
          <Box sx={{ paddingTop: "10px" }}>
            <TextField
              label="Nickname"
              sx={{ width: "100%" }}
              value={nickname}
              onChange={(e) => setnickname(e.target.value)}
            />
          </Box>
          <Box sx={{ paddingTop: "10px", display: "flex", gap: "5px" }}>
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <InputLabel id="year-label">Birthday Year</InputLabel>
              <Select
                labelId="year-label"
                id="year-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                label="Birthday Year"
              >
                {[...Array(16).keys()].map((i) => (
                  <MenuItem key={i} value={2010 + i}>
                    {2010 + i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <InputLabel id="month-label">Birthday Month</InputLabel>
              <Select
                labelId="month-label"
                id="month-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                label="Birthday Month"
              >
                {[...Array(12).keys()].map((i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }} variant="outlined">
              <InputLabel id="date-label">Birthday Day</InputLabel>
              <Select
                labelId="date-label"
                id="date-select"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                label="Birthday Day"
              >
                {[...Array(31).keys()].map((i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ paddingTop: "10px" }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Gender"
              >
                <MenuItem value="Male">Boy</MenuItem>
                <MenuItem value="Female">Girl</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              paddingTop: "15px",
              paddingBottom: "10px",
              textAlign: "center",
            }}
          >
            <Button variant="contained" onClick={updateProfile}>
              确认更新
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default CreateProfile;
