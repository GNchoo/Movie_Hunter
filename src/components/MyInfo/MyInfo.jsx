import React, { useState } from "react";
import bg from "../../assets/body-bg.jpg";
import { Button, Table } from "./MyInfo.styled";
import DatePicker from "react-datepicker";
import { ServerApi } from "../../api/ServerApi";
import { ko } from "date-fns/esm/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyInfo = () => {
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  const birth = localStorage.getItem("birth");
  const sex = localStorage.getItem("sex");

  const [userId, setUserId] = useState(id);
  const [userName, setUserName] = useState(name);
  const [userBirth, setUserBirth] = useState(new Date());
  const [userSex, setUserSex] = useState(sex);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const userModify = (event) => {
    event.preventDefault();
    const updatedUserData = {
      username: userId,
      name: userName,
      birth: userBirth.toISOString().slice(0, 10),
      sex: userSex,
    };
    localStorage.setItem("id", userId);
    localStorage.setItem("name", userName);
    localStorage.setItem("birth", userBirth.toISOString().slice(0, 10));
    localStorage.setItem("sex", userSex);
    axios
      .put(`${ServerApi}/user`, updatedUserData)
      .then((response) => {
        setIsEditing(false);
        navigate("/mypage");
      })
      .catch((error) => console.log(error));
  };

  const HandleClickRadioButton = (e) => {
    console.log(e.target.value);
    setUserSex(e.target.value);
  };

  const userDelete = (event) => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      event.preventDefault();
      localStorage.clear();
      axios
        .delete(`${ServerApi}/user`)
        .then((response) => {
          console.log(response);
          navigate("/");
        })
        .catch((error) => console.log(error));
    } else {
      navigate("/mypage");
    }
  };

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h1>회원 정보</h1>
        {isEditing ? (
          <div>
            <Table className="userInfo">
              <tbody>
                <tr>
                  <td>아이디</td>
                  <td>
                    <input
                      type="text"
                      name="uid"
                      placeholder={id}
                      disabled={true}
                      onChange={(e) => setUserId(e.target.value)}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>닉네임</td>
                  <td>
                    <input
                      type="text"
                      name="uid"
                      onChange={(e) => setUserName(e.target.value)}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>생년월일</td>
                  <td>
                    <DatePicker
                      locale={ko}
                      selected={userBirth}
                      dateFormat="yyyy/MM/dd"
                      onChange={(date) => setUserBirth(date)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>성별</td>
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
            </Table>
          </div>
        ) : (
          <Table className="userInfo">
            <tbody>
              <tr>
                <td>아이디</td>
                <td>{userId}</td>
              </tr>
              <tr>
                <td>닉네임</td>
                <td>{userName}</td>
              </tr>
              <tr>
                <td>생년월일</td>
                <td>{birth}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{userSex}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </div>
      <div className="userInfoButton">
        {isEditing ? (
          <div>
            <Button onClick={userModify}>수정하기</Button>
            <Button onClick={() => setIsEditing(false)}>취소</Button>
          </div>
        ) : (
          <div>
            <Button onClick={() => setIsEditing(true)}>수정</Button>
            <Button onClick={userDelete}>탈퇴</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInfo;
