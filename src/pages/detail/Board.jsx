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
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  const [userId, setUserId] = useState(id); // 작성자 id 값
  const [user, setUser] = useState(name); // 작성자 state
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
    console.log(userId); // 클라이언트 확인용
    setUserId(userId); // 유저 아이디 값 실어서 보냄

    axios
      .post(`${ServerApi}/board/add`, {
        title,
        user,
        text,
        userId,
      })
      .then((response) => {
        // API 호출을 통해 게시글 목록 다시 불러오기
        axios.get(`${ServerApi}/board/list`).then((response) => {
          setText(response.data);
          navigate(`/board/list`); // 글쓰기가 완료되면 게시판 목록 페이지로 이동
        });
      })
      .catch((error) => console.log(error));

    setText(""); // 글쓰기 완료 후 새로운 게시글 내용 초기화
    setTitle(""); // 글쓰기 완료 후 새로운 게시글 제목 초기화
  };

  const editorConfiguration = {
    language: "ko",
    toolbar: ["heading", "|", "bold", "italic", "|", "undo", "redo"],
    heading: {
      options: [
        { model: "paragraph", title: "본문", class: "ck-heading_paragraph" },
      ],
    },
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
          <span
            style={{
              position: "relative",
              padding: "7px",
              border: "1px solid #fff",
              borderRadius: "5px",
              backgroundColor: "green",
            }}
          >
            작성자
          </span>
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
            value={user}
            disabled={true}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          onChange={handlePostChange}
          value={text}
        />
        <button
          type="submit"
          style={{
            margin: "0 auto",
            display: "block",
            marginTop: "10px",
            marginBottom: "5px",
          }}
        >
          글쓰기
        </button>
      </form>
    </div>
  );
}

export default Board;
