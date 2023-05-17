import React, { useState } from "react";
import bg from "../../assets/body-bg.jpg";
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

    axios
      .put(`${ServerApi}/mypage`, updatedUserData)
      .then((response) => {
        localStorage.setItem("id", userId);
        localStorage.setItem("name", userName);
        localStorage.setItem("birth", userBirth.toISOString().slice(0, 10));
        localStorage.setItem("sex", userSex);
        setIsEditing(false);
        navigate("/mypage");
      })
      .catch((error) => console.log(error));
  };

  const userDelete = (event) => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      event.preventDefault();
      localStorage.clear();
      axios
        .delete(`${ServerApi}/mypage`, { data: { id: userId } })
        .then((response) => {
          navigate("/");
        })
        .catch((error) => console.log(error));
    } else {
      navigate("/mypage");
    }
  };

  console.log(userSex);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h1>회원 정보</h1>
        {isEditing ? (
          <div>
            <table style={{ width: "20%" }}>
              <tbody>
                <tr>
                  <td>
                    <label>아이디</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="uid"
                      value={userId}
                      disabled={true}
                      onChange={(e) => setUserId(e.target.value)}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>닉네임</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="uid"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>생년월일</label>
                  </td>
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
                  <td>
                    <label>성별</label>
                  </td>
                  <td>
                    <div>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={userSex === "male"}
                        onChange={(e) => setUserSex(e.target.value)}
                      />
                      <label>남자</label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={userSex === "female"}
                        onChange={(e) => setUserSex(e.target.value)}
                      />
                      <label>여자</label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <table style={{ width: "20%" }}>
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
          </table>
        )}
      </div>
      <div className="userInfoButton">
        {isEditing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button onClick={userModify}>수정하기</button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button onClick={() => setIsEditing(true)}>수정</button>
            <button onClick={userDelete}>탈퇴</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInfo;
