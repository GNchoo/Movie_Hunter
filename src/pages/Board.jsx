import React, { useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useNavigate } from "react-router";
import "./Board.scss";
import bg from "../assets/body-bg.jpg";
import { ServerApi } from "../api/ServerApi";
import axios from "axios";

function Board() {
  const [title, setTitle] = useState("");
  const id = localStorage.getItem("id");
  const name = localStorage.getItem("name");
  const [userId, setUserId] = useState(id);
  const [user, setUser] = useState(name);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handlePostChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      alert("제목을 작성해주세요.");
      return;
    }

    const contentState = editorState.getCurrentContent();
    const contentPlainText = contentState.getPlainText("\u0001");
    const rawContentState = convertToRaw(contentState);

    setUserId(userId);

    axios
      .post(`${ServerApi}/board/add`, {
        title,
        user,
        text: rawContentState,
        userId,
      })
      .then((response) => {
        axios.get(`${ServerApi}/board/list`).then((response) => {
          setText(response.data);
          navigate(`/board/list`);
        });
      })
      .catch((error) => console.log(error));

    setEditorState(EditorState.createEmpty());
    setTitle("");
  };

  const hideToolbarOptions = {
    options: [
      "blockType",
      "inline",
      "list",
      "textAlign",
      "link",
      "embedded",
      "emoji",
      "image",
      "remove",
      "history",
    ],
    blockType: {
      inDropdown: true,
      options: ["Normal"],
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
        <Editor
          editorState={editorState}
          onEditorStateChange={handlePostChange}
          toolbarCustomizations={hideToolbarOptions}
          wrapperClassName="board-wrapper"
          editorClassName="board-editor"
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
