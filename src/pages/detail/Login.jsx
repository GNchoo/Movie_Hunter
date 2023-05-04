import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerApi } from "../../api/ServerApi";

import "./Login.scss";

import bg from "../../assets/body-bg.jpg";
import bg2 from "../../assets/login-bg.jpg";
const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("id")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${ServerApi}/login/`, {
        username,
        password,
      });
      // console.log(response.data); 데이터 확인용
      alert("로그인 성공");
      localStorage.setItem("id", response.data.username);
      navigate("/");
    } catch (error) {
      alert("아이디나 비밀번호를 다시 확인해주세요.");
      console.log(error);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>로그인</h2>
      </div>
      <div
        className="login-container"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
          <div className="id">
            <Input
              type="text"
              placeholder="아이디 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="password">
            <Input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <Button className="small" type="submit">
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
