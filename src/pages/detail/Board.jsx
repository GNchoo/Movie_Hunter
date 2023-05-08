import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router";
import "./Board.scss";
import bg from "../../assets/body-bg.jpg";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";

function Board() {
  const [title, setTitle] = useState(""); // 새로운 게시글의 제목을 담는 state
  const [text, setText] = useState([]); // 새로운 게시글을 담는 state
  const navigate = useNavigate();

  const handlePostChange = (event, editor) => {
    const data = editor.getData();
    setText(data.replace(/(<([^>]+)>)/gi, ""));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(title); // 클라이언트 확인용
    console.log(text); //  클라이언트 확인용

    axios
      .post(`${ServerApi}/board/add`, {
        title,
        text,
      })
      .then((response) => {
        // API 호출을 통해 게시글 목록 다시 불러오기
        axios.get(`${ServerApi}/board/list`).then((response) => {
          setText(response.data);
          navigate(`${ServerApi}/board/list`); // 글쓰기가 완료되면 게시판 목록 페이지로 이동
        });
      })
      .catch((error) => console.log(error));

    setText(""); // 글쓰기 완료 후 새로운 게시글 내용 초기화
    setTitle(""); // 글쓰기 완료 후 새로운 게시글 제목 초기화
  };

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>게시판</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              position: "relative",
              padding: "7px",
              border: "1px solid #fff",
              borderRadius: "5px",
              backgroundColor: "green",
            }}
          >
            제목
          </span>
          <input
            style={{
              width: "400px",
              backgroundColor: "#fff",
              color: "black",
              position: "relative",
              zIndex: 1,
            }}
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <CKEditor
          editor={ClassicEditor}
          onChange={handlePostChange}
          value={text}
        />
        <button
          type="submit"
          style={{ margin: "0 auto", display: "block", marginTop: "10px" }}
        >
          글쓰기
        </button>
      </form>
    </div>
  );
}

export default Board;
