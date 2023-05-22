import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import "./ChuChon.scss";

import bg from "../../assets/body-bg.jpg";
import bg2 from "../../assets/login-bg.jpg";
const ChuChon = (props) => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(props.keyword ? props.keyword : "");

  const goToSearch = useCallback(() => {
    if (keyword.trim().length > 0) {
      navigate(`/movie/search/${keyword}`);
    }
  }, [keyword, navigate]);

  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [keyword, goToSearch]);

  const goToSearch2 = useCallback(() => {
    if (keyword.trim().length > 0) {
      navigate(`/tv/search/${keyword}`);
    }
  }, [keyword, navigate]);

  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        goToSearch2();
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [keyword, goToSearch2]);
  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>영상 검색 & 비슷한 영상 추천</h2>
      </div>
      <div className="login-container" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="movie-search">
          <Input type="text" placeholder="키워드 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
        <div>
          <Button className="small" onClick={goToSearch}>
            영화 검색
          </Button>
          <Button className="small" onClick={goToSearch2}>
            TV 검색
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChuChon;
