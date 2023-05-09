import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/body-bg.jpg";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";

function BoardList() {
  const [titles, setTitles] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios
      .get(`${ServerApi}/board/list`)
      .then((response) => {
        console.log(response.data);
        setTitles(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>게시판 목록</h2>
      </div>
      <ul>
        {titles.map((title) => (
          <li key={title.id}>
            <Link to={`/board/${title.id}`}>{title.title}</Link>
          </li>
        ))}
      </ul>
      <Link to={"/board"}>
        <button
          style={{ display: "block", margin: "0 auto", marginBottom: "5px" }}
        >
          글쓰기
        </button>
      </Link>
    </div>
  );
}

export default BoardList;
