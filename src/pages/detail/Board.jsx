import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router";
import "./Board.scss";
import bg from "../../assets/body-bg.jpg";

function Board() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const handlePostChange = (event, editor) => {
    const data = editor.getData();
    setNewPost(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 새로운 게시글을 서버에 전송하는 API 호출
    fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ content: newPost }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        // 게시글 목록을 다시 불러오는 API 호출
        fetch("/api/posts")
          .then((response) => response.json())
          .then((data) => setPosts(data));
        setPosts(data);
        navigate.push("/board-list"); // 글쓰기가 완료되면 BoardList 페이지로 이동
      });

    setNewPost("");
  };

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>게시판</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <CKEditor
          editor={ClassicEditor}
          onChange={handlePostChange}
          value={newPost}
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
