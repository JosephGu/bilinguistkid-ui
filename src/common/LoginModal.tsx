"use client";

import { Box, TextField, Dialog, Tab, Tabs, Button } from "@mui/material";
import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";
import { createUser, login } from "@/app/actions/user";

function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeButtonDisabled, setCodeButtonDisabled] = useState(false);

  const loginClick = async (formData: FormData) => {
    const response = await login(formData);
    console.log(response);
    // const res = await fetch("/api/v1/auth/authenticate", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: email,
    //     password: password,
    //   }),
    // });
    // const data = await res.json();

    // if (res.status === 200) {
    //   console.log("redirect to home");
    //   redirect("/", RedirectType.replace);
    // } else {
    //   alert("Login failed");
    // }
  };

  const createAccountClick = async () => {
    if (email.length === 0) {
      alert("Please input email");
      return;
    }
    if (code.length === 0) {
      alert("Please input verification code");
      return;
    }
    if (password.length === 0) {
      alert("Please input password");
      return;
    }
    if (confirmPassword.length === 0) {
      alert("Please input confirm password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        verificationcode: code,
      }),
    });
    if (res.ok) {
      const data = await res.json(); // 解析JSON响应体
      console.log(data); // 打印响应体数据

      if (data?.code === 200) {
        redirect("/", RedirectType.push);
      } else if (data?.code === 4001) {
        alert("Verification code error, please try again");
      } else if (data?.code === 4002) {
        alert("Email already registered, please sign in");
      } else {
        alert("Create account failed");
      }
    } else {
      alert("Create account failed");
    }
  };

  const [timer, setTimer] = useState(60);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setTimer(60);
      setCodeButtonDisabled(false);
    }, 60000);
  };

  const getVerificationCode = async () => {
    if (email.length === 0) {
      alert("Please input email");
      return;
    }
    setCodeButtonDisabled(true);
    startTimer();

    const res = await fetch("/api/v1/auth/verify-code/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: email,
    });
    console.log(res.status);
  };

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const confirmClick = async () => {
    if (tabIndex === 0) {
      const formData = new FormData();
      formData.append("email",email);
      formData.append("password",password);
      await loginClick(formData);
    } else {
      await createAccountClick();
    }
  };

  return (
    <Dialog open fullWidth>
      <form action={confirmClick}>
        <Box sx={{ width: "100%" }}>
          <Tabs onChange={handleChange} value={tabIndex}>
            <Tab label="Sign In" value={0}></Tab>
            <Tab label="Sign Up" value={1}></Tab>
          </Tabs>
        </Box>

        <Box
          component="form"
          sx={{ padding: "10px 30px" }}
          hidden={tabIndex === 1}
        >
          <Box sx={{ paddingTop: "10px" }}>
            <TextField
              label="Email"
              sx={{ width: "100%" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box sx={{ paddingTop: "10px" }}>
            <TextField
              label="Password"
              sx={{ width: "100%" }}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
        </Box>
        <Box
          component="form"
          sx={{ padding: "10px 30px", width: "100%" }}
          hidden={tabIndex === 0}
        >
          <Box sx={{ paddingTop: "10px" }}>
            <TextField
              label="Email"
              sx={{ width: "100%" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Box
            sx={{ paddingTop: "10px", display: "flex", gap: 2, width: "100%" }}
          >
            <TextField
              label="Verification Code"
              sx={{ flex: 0.7 }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ flex: 0.3 }}
              onClick={getVerificationCode}
              disabled={codeButtonDisabled}
            >
              {codeButtonDisabled
                ? `Resend after ${timer} seconds`
                : "Send Code"}
            </Button>
          </Box>
          <Box sx={{ paddingTop: "10px" }}>
            <TextField
              label="Password"
              sx={{ width: "100%" }}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Box sx={{ paddingTop: "10px" }}>
            <TextField
              label="Confirm Password"
              sx={{ width: "100%" }}
              value={confirmPassword}
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
        </Box>
        <Box
          sx={{ padding: "10px 0" }}
          display={"flex"}
          justifyContent={"center"}
        >
          <Button variant="contained" type="submit">
            {tabIndex === 0 ? "Sign In" : "Sign Up"}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
}

export default LoginModal;
