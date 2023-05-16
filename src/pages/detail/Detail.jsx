import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";

import MovieList from "../../components/movie-list/MovieList";

import { ImStarFull, ImStarEmpty } from "react-icons/im";

import styled from "styled-components";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import axios from "axios";
import { ServerApi } from "../../api/ServerApi";

const RatingBox = styled.div`
  margin: 0 auto;

  & svg {
    color: #c4c4c4;
    cursor: pointer;
  }

  .yellow {
    color: yellow;
  }
  .rating {
    :hover svg {
      color: yellow;
    }
    & svg:hover ~ svg {
      color: #c4c4c4;
    }
  }
`;

function sumArray(arr) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

const Detail = () => {
  const { category, id } = useParams();
  const [item, setItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const PER_PAGE = 3;
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  const start = (currentPage - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const [searchResults, setSearchResults] = useState([]);
  const currentList =
    searchResults.length > 0 ? searchResults : list.slice(start, end);

  const array = [0, 1, 2, 3, 4]; // 별점 5개
  const [clicked, setClicked] = useState([true, false, false, false, false]); // 1 true 0 false

  const _id = localStorage.getItem("id"); // 로컬스토리지의 아이디 담기
  const [userId, setUserId] = useState(_id); // 작성자 state
  const name = localStorage.getItem("name"); // 로컬스토리지의 이름 담기
  const [writer, setWriter] = useState(name); // 작성자 state
  const [text, setText] = useState([]); // 새로운 게시글을 담는 state
  const sex = localStorage.getItem("sex"); // 로컬스토리지의 성별 담기
  const [writerSex, setWriterSex] = useState(sex);
  const currentYear = new Date().getFullYear();
  const birth = localStorage.getItem("birth");
  const [writerBirth, setWriterBirth] = useState(birth);

  const navigate = useNavigate();

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
      window.scrollTo(0, 0);
    };
    getDetail();
  }, [category, id]);

  const handleStarClick = (index) => {
    let clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }
    setClicked(clickStates);
  };

  const handlePostChange = (event, editor) => {
    const data = editor.getData();
    setText(data.replace(/(<([^>]+)>)/gi, ""));
  };

  const editorConfig = {
    toolbar: [],
    styles: {
      color: "black",
    },
  };

  useEffect(() => {
    axios
      .get(`${ServerApi}/movie/${id}`)
      .then((response) => {
        console.log(response.data);
        setList(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

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

  const CommentWrite = (event) => {
    event.preventDefault();
    setUserId(userId);
    setWriter(writer); // 작성자 값 실어서 보냄
    setWriterSex(writerSex); // 작성자 값 실어서 보냄
    setWriterBirth(writerBirth.substring(0, 4)); // 작성자 값 실어서 보냄
    setClicked(clicked);

    axios
      .post(`${ServerApi}/movie/${id}/add`, {
        username: userId,
        text: text,
        writer: writer,
        star: sumArray(clicked),
        sex: writerSex,
        age: currentYear - writerBirth.substring(0, 4) + 1,
      })
      .then((response) => {
        // API 호출을 통해 한줄평 목록 다시 불러오기
        axios.get(`${ServerApi}/movie/${id}`).then((response) => {
          setText(response.data);
          navigate(`/movie`); // 글쓰기가 완료되면 영화 페이지로 재 리다이렉트
        });
      })
      .catch((error) => console.log(error));

    setText(""); // 글쓰기 완료 후 새로운 텍스트 내용 초기화
  };

  const commentDelete = (event, commentId) => {
    event.preventDefault();
    axios
      .delete(`${ServerApi}/movie/${id}`, { data: { _id: commentId } })
      .then((response) => {
        console.log(response);
        navigate("/movie");
      })
      .catch((error) => console.log(error));
  };

  let totalStar = 0;
  let averageStar = 0;

  list.forEach((list) => {
    if (!isNaN(list.star)) {
      totalStar += list.star;
    }
  });

  if (list.length > 0) {
    averageStar = totalStar / list.length;
    averageStar = Math.round(averageStar); // 반올림 처리
  }

  console.log("list.star의 총합:", totalStar);
  console.log("list.star의 평균:", averageStar);
  console.log("리스트의 갯수:", list.length);

  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          ></div>
          <div className="mb-3 movie-content container">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${apiConfig.originalImage(
                    item.poster_path || item.backdrop_path
                  )})`,
                }}
              ></div>
            </div>
            <div className="movie-content__info">
              <h1 className="title">{item.title || item.name}</h1>
              <RatingBox style={{ marginBottom: "20px" }}>
                {array.map((index) => (
                  <ImStarFull
                    key={index}
                    className={index < averageStar ? "yellow" : ""}
                    size="40"
                  />
                ))}
              </RatingBox>
              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, i) => (
                    <span key={i} className="genres__item">
                      {genre.name}
                    </span>
                  ))}
              </div>
              <p className="overview">{item.overview}</p>
              <div className="cast">
                <div className="section__header">
                  <h2>출연진</h2>
                </div>
                <CastList id={item.id} />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="section mb-3">
              <h2>유튜브 트레일러 보기</h2>
              <VideoList id={item.id} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <h2>한줄평</h2>
                <table>
                  {currentList.map((list) => (
                    <tr key={list.id}>
                      <td>
                        {list._id}
                        {writer === list.writer && ( //!조건 작성자일치시(나중에 아이디값으로 교체 예정)
                          <button
                            onClick={(event) => commentDelete(event, list._id)}
                          >
                            X
                          </button>
                        )}
                      </td>
                      <td>{list.text}</td>
                      <td>{list.writer}</td>
                      <td>
                        <RatingBox>
                          {array.map((index) => (
                            <ImStarFull
                              key={index}
                              className={index < list.star ? "yellow" : ""}
                              size="18"
                            />
                          ))}
                        </RatingBox>
                      </td>
                      <td>{list.date}</td>
                    </tr>
                  ))}
                </table>
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
                <div>
                  <input
                    style={{
                      width: "100px",
                      backgroundColor: "#333",
                      color: "#fff",
                      position: "relative",
                      zIndex: 1,
                    }}
                    type="text"
                    name="user"
                    value={writer}
                    disabled={true}
                    onChange={(e) => setWriter(e.target.value)}
                  />
                  <RatingBox className="rating">
                    {array.map((el) => (
                      <ImStarFull
                        key={el}
                        onClick={() => handleStarClick(el)}
                        className={clicked[el] && "yellow"}
                        size="20"
                      />
                    ))}
                  </RatingBox>
                </div>
                <br />
                <div>
                  <CKEditor
                    className="comment"
                    editor={ClassicEditor}
                    config={editorConfig}
                    onChange={handlePostChange}
                    value={text}
                  />
                  <button onClick={CommentWrite}>작성하기</button>
                </div>
              </div>
            </div>
            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2>비슷한 영화 추천</h2>
              </div>
              <MovieList category={category} type="similar" id={item.id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
