import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerApi } from "../../api/ServerApi";

import "./Login.scss";

import bg from "../../assets/body-bg.jpg";
import bg2 from "../../assets/login-bg.jpg";
const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${ServerApi}/login/`, {
        username,
        password,
      });
      console.log(response);
      alert("로그인 성공");
      navigate("/home");
      localStorage.setItem("id", response.data.username);
      localStorage.setItem("name", response.data.name);
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
          <br />
          <div className="Sign">
            <Link to="/Sign">
              <h5>회원 가입</h5>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
