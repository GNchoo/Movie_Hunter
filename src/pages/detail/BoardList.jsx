import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/body-bg.jpg";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";
import "./BoardList.scss";

function BoardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const PER_PAGE = 10;
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const [searchResults, setSearchResults] = useState([]);
  const currentList =
    searchResults.length > 0 ? searchResults : list.slice(start, end);

  const [selectedFilter, setSelectedFilter] = useState("title");
  const [searchValue, setSearchValue] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    axios
      .get(`${ServerApi}/board/list`)
      .then((response) => {
        setList(response.data);
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
    if (currentPage === Math.ceil(list.length / PER_PAGE)) {
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearch(false);
      const title = selectedFilter === "title" ? searchValue : null;
      const writer = selectedFilter === "writer" ? searchValue : null;
      const results = list.filter(
        (item) =>
          (!title || item.title.includes(title)) &&
          (!writer || item.writer.includes(writer))
      );
      setSearchResults(results);
      setCurrentPage(1);
      if (results.length === 0) {
        setSearchResults([]);
        setIsSearch(true);
      }
    }
  };

  console.log(isSearch);

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
          {searchResults.length > 0 ? (
            currentList.map((list) => (
              <tr key={list.id}>
                <td>{list._id}</td>
                <td>
                  <Link to={`/board/list/${list._id}`}>{list.title}</Link>
                </td>
                <td>{list.writer}</td>
                <td>{list.date}</td>
                <td>{list.views}</td>
              </tr>
            ))
          ) : isSearch === true ? (
            <tr>
              <td colSpan="5">검색 결과가 없습니다.</td>
            </tr>
          ) : (
            list.slice(start, end).map((list) => (
              <tr key={list.id}>
                <td>{list._id}</td>
                <td>
                  <Link to={`/board/list/${list._id}`}>{list.title}</Link>
                </td>
                <td>{list.writer}</td>
                <td>{list.date}</td>
                <td>{list.views}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div>
        <div className="board-buttons">
          <div style={{ marginTop: "15px" }}>
            <select
              style={{ height: "34px" }}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="title">제목</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder={`${
                selectedFilter === "title" ? "제목" : "작성자"
              }로 검색`}
            />
          </div>
          <span
            className="material-icons"
            onClick={() => {
              const enterEvent = new KeyboardEvent("keydown", {
                key: "Enter",
                keyCode: 13,
                view: window,
              });
              handleSearch(enterEvent);
            }}
          >
            search
          </span>
          <Link to={"/board"}>
            <button style={{ height: "30px" }}>글쓰기</button>
          </Link>
        </div>
      </div>
      <div className="board-pagination">
        <span className="material-icons" onClick={handlePrevPage}>
          arrow_back_ios
        </span>
        <span onClick={handlePrevPage}>Prev</span>
        <span>
          {currentPage} / {totalPages}
        </span>
        <span onClick={handleNextPage}>Next</span>
        <span className="material-icons" onClick={handleNextPage}>
          arrow_forward_ios
        </span>
      </div>
    </div>
  );
}

export default BoardList;
