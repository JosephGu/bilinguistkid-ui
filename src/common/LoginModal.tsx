"use client";

import { Box, TextField, Dialog, Tab, Tabs, Button } from "@mui/material";
import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";
import { login, register, getVCode } from "@/app/actions/user";
import {useTranslations} from 'next-intl';

function LoginModal() {
   const t = useTranslations('LoginModal');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeButtonDisabled, setCodeButtonDisabled] = useState(false);

  const loginClick = async (formData: FormData) => {
    const response = await login(formData);
    if (response.success) {
      redirect("/", RedirectType.replace);
    } else {
      alert(response.msg);
    }
    console.log(response);
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
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("vCode", code);
    const response = await register(formData);
    if (response.success) {
      redirect("/", RedirectType.replace);
    } else {
      alert(response.msg);
    }
    console.log(response);
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
    const formData = new FormData();
    formData.append("email", email);
    setCodeButtonDisabled(true);

    startTimer();
    const response = await getVCode(formData);

    console.log(response);
  };

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const confirmClick = async () => {
    if (tabIndex === 0) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      await loginClick(formData);
    } else {
      await createAccountClick();
    }
  };

  return (
    <Dialog open fullWidth>
      <Box sx={{ width: "100%" }}>
        <Tabs onChange={handleChange} value={tabIndex}>
          <Tab label={t('SignIn')} value={0}></Tab>
          <Tab label={t('SignUp')} value={1}></Tab>
        </Tabs>
      </Box>

      <Box
        component="form"
        sx={{ padding: "10px 30px" }}
        hidden={tabIndex === 1}
      >
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label={t('Email')}
            sx={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label={t('Password')}
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
            label={t('Email')}
            sx={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box
          sx={{ paddingTop: "10px", display: "flex", gap: 2, width: "100%" }}
        >
          <TextField
            label={t('VerificationCode')}
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
            {codeButtonDisabled ? `${t('ResendCode')} after ${timer} seconds` : t('SendCode')}
          </Button>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label={t('Password')}
            sx={{ width: "100%" }}
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label={t('ConfirmPassword')}
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
        <Button variant="contained" type="submit" onClick={confirmClick}>
          {tabIndex === 0 ? t('SignIn') : t('SignUp')}
        </Button>
      </Box>
    </Dialog>
  );
}

export default LoginModal;
