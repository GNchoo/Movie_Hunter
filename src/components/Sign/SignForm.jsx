import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Warning } from "./SignForm.style";
import axios from "axios";
import { ServerApi } from "../../api/ServerApi";
import Input from "../input/Input";
import Button from "../button/Button";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";

import "react-datepicker/dist/react-datepicker.css";

const SignForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState(new Date());
  const [sex, setSex] = useState([]);
  const [passwordOk, setPasswordOk] = useState(false);

  const containsSpecialCharacter = (pw) => {
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharacterRegex.test(pw);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!containsSpecialCharacter(password)) {
      alert("비밀번호에는 최소 1개의 특수 문자가 포함되어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post(`${ServerApi}/Sign`, {
        username,
        password,
        name,
        birth: birth.toISOString().slice(0, 10),
        sex,
      });
      alert("회원가입 성공");
      console.log(response);
      navigate("/movie");
    } catch (error) {
      console.log(error);
      if (error.response.data.detail === "Username already registered") {
        alert("아이디가 이미 존재합니다.");
      }
    }
  };

  const HandleClickRadioButton = (e) => {
    console.log(e.target.value);
    setSex(e.target.value);
  };

  return (
    <div>
      <Container>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>
                  <label>아이디</label>
                </td>
                <td>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>비밀번호</label>
                </td>
                <td>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (containsSpecialCharacter(e.target.value)) {
                        setPasswordOk(true);
                      } else {
                        setPasswordOk(false);
                      }
                    }}
                    required
                  />
                  <br />
                  {!passwordOk ? (
                    <Warning>반드시 특수문자 1개 이상 포함해야 합니다.</Warning>
                  ) : null}
                </td>
              </tr>
              <tr>
                <td>
                  <label>비밀번호 확인</label>
                </td>
                <td>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>닉네임</label>
                </td>
                <td>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>생년월일</label>
                </td>
                <td>
                  <DatePicker
                    locale={ko}
                    selected={birth}
                    dateFormat="yyyy/MM/dd"
                    onChange={(date) => setBirth(date)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>성별</label>
                </td>
                <td>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={sex === "male"}
                    onChange={HandleClickRadioButton}
                  />
                  <label>남자</label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={sex === "female"}
                    onChange={HandleClickRadioButton}
                  />
                  <label>여자</label>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <Button type="submit">회원가입</Button>
      </Container>
    </div>
  );
};

export default SignForm;
