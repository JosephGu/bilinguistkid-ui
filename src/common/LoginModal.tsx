"use client";

import { Box, TextField, Dialog, Tab, Tabs, Button } from "@mui/material";
import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";


function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeButtonDisabled, setCodeButtonDisabled] = useState(false);


  const loginClick = async () => {
    const res = await fetch("/api/v1/auth/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();

    if (res.status === 200) {
      console.log('redirect to home');
      redirect("/",RedirectType.push);
    }
    else{
      alert("登录失败");
    }

  };

  const createAccountClick = async () => {
    if (email.length === 0) {
      alert("请输入邮箱");
      return;
    }
    if (code.length === 0) {
      alert("请输入验证码");
      return;
    }
    if (password.length === 0) {
      alert("请输入密码");
      return;
    }
    if (confirmPassword.length === 0) {
      alert("请输入确认密码");
      return;
    }

    if (password !== confirmPassword) {
      alert("两次密码不一致");
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
        redirect("/",RedirectType.push);
      }
      else if(data?.code === 4001){
        alert("验证码错误，请重试");
      }
      else if(data?.code === 4002){
        alert("邮箱已注册，请登录");
      }
      else{
        alert("创建失败");
      }

    } else {
      alert("创建失败");
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
      alert("请输入邮箱");
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
      await loginClick();
    } else {
      await createAccountClick();
    }
  };

  return (
    <Dialog open fullWidth>
      <Box sx={{ width: "100%" }}>
        <Tabs onChange={handleChange} value={tabIndex}>
          <Tab label="登录" value={0}></Tab>
          <Tab label="创建账号" value={1}></Tab>
        </Tabs>
      </Box>

      <Box
        component="form"
        sx={{ padding: "10px 30px" }}
        hidden={tabIndex === 1}
      >
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label="邮箱"
            sx={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label="密码"
            sx={{ width: "100%" }}
            value={password}
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
            label="邮箱"
            sx={{ width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box
          sx={{ paddingTop: "10px", display: "flex", gap: 2, width: "100%" }}
        >
          <TextField
            label="验证码"
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
            {codeButtonDisabled ? `${timer}秒后重新发送` : "发送验证码"}
          </Button>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label="密码"
            sx={{ width: "100%" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
          <TextField
            label="确认密码"
            sx={{ width: "100%" }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        sx={{ padding: "10px 0" }}
        display={"flex"}
        justifyContent={"center"}
      >
        <Button onClick={() => confirmClick()} variant="contained">
          {tabIndex === 0 ? "登录" : "创建账号"}
        </Button>
        <Button>返回</Button>
      </Box>
    </Dialog>
  );
}

export default LoginModal;
