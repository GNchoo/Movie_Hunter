import React from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { Link } from "react-router-dom";

import "./Login.scss";

import bg from "../../assets/body-bg.jpg";
import bg2 from "../../assets/login-bg.jpg";
const TryLogin = (() => {}, []);
const Login = (props) => {
  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>로그인</h2>
      </div>
      <div className="login-container" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="id">
          <Input type="text" placeholder="아이디 입력" onChange={(e) => e.target.value} />
        </div>
        <div className="id">
          <Input type="text" placeholder="비밀번호 입력" onChange={(e) => e.target.value} />
        </div>
        <Button className="small" onClick={TryLogin}>
          로그인
        </Button>
        <div className="SignForm">
          <Link to="/SignForm">
            <h5>회원 가입</h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
