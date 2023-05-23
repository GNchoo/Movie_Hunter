import React, { useEffect, useState } from "react";
import bg from "../../assets/body-bg.jpg";
import DatePicker from "react-datepicker";
import { ServerApi } from "../../api/ServerApi";
import { ko } from "date-fns/esm/locale";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyInfo.scss";
import MovieList from "../movie-list/MovieList";
import { category, movieType, tvType } from "../../api/tmdbApi";

import apiConfig from "../../api/apiConfig";

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
  const [movieLike, setMovieLike] = useState([]);
  const [tvLike, setTvLike] = useState([]);

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

  useEffect(() => {
    const fetchMovieLikes = async () => {
      try {
        const response = await axios.get(
          `${ServerApi}/mypage?username=${userId}`
        );
        setMovieLike(response.data.movieLikes);
        setTvLike(response.data.tvLikes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovieLikes();
  }, [userId]);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h1>회원 정보</h1>
      </div>
      {isEditing ? (
        <div>
          <table className="myinfo">
            <tbody>
              <tr>
                <th>
                  <label>아이디</label>
                </th>
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
                <th>
                  <label>닉네임</label>
                </th>
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
                <th>
                  <label>생년월일</label>
                </th>
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
                <th>
                  <label>성별</label>
                </th>
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
        <table className="myinfo">
          <tbody>
            <tr>
              <th>아이디</th>
              <td>{userId}</td>
            </tr>
            <tr>
              <th>닉네임</th>
              <td>{userName}</td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>{birth}</td>
            </tr>
            <tr>
              <th>성별</th>
              <td>{userSex}</td>
            </tr>
          </tbody>
        </table>
      )}
      <div className="userInfoButton">
        {isEditing ? (
          <div>
            <button onClick={userModify}>수정하기</button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setIsEditing(true)}>수정</button>
            <button onClick={userDelete}>탈퇴</button>
          </div>
        )}
      </div>
      <div className="container">
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>내가 좋아요한 영화</h2>
          </div>
          <MovieList category={category.movie} type={movieType.top_rated} />
        </div>
      </div>

      <div className="container">
        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>내가 좋아요한 TV 프로그램</h2>
          </div>
          <MovieList category={category.tv} type={movieType.top_rated} />
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
