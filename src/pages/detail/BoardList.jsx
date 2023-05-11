import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/body-bg.jpg";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";
import "./BoardList.scss";

function BoardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [titles, setTitles] = useState([]);
  const PER_PAGE = 10;
  const totalItems = titles.length;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  useEffect(() => {
    axios
      .get(`${ServerApi}/board/list`)
      .then((response) => {
        console.log(response.data);
        setTitles(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handlePrevPage = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage === Math.ceil(titles.length / PER_PAGE)) {
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const currentTitles = titles.slice(start, end);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>게시판 목록</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {currentTitles.map((title) => (
            <tr key={title.id}>
              <td>{title._id}</td>
              <td>
                <Link to={`/board/list/${title._id}`}>{title.title}</Link>
              </td>
              <td>{title.writer}</td>
              <td>{title.date}</td>
              <td>{title.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="board-buttons">
        <Link
          to={"/board"}
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "flex-end",
            marginBottom: "20px",
            marginLeft: "auto",
          }}
        >
          <button>글쓰기</button>
        </Link>
      </div>
      <div className="board-pagination">
        <span class="material-icons" onClick={handlePrevPage}>
          arrow_back_ios
        </span>
        <span onClick={handlePrevPage}>Prev</span>
        <span>
          {currentPage} / {totalPages}
        </span>
        <span onClick={handleNextPage}>Next</span>
        <span class="material-icons" onClick={handleNextPage}>
          arrow_forward_ios
        </span>
      </div>
    </div>
  );
}

export default BoardList;
