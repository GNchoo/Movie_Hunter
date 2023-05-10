import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import bg from "../../assets/body-bg.jpg";
import bg2 from "../../assets/login-bg.jpg";
import "./BoardDetail.scss";

const BoardDetail = () => {
  const [boardData, setBoardData] = useState({});
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [writer, setWriter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams(); // useParams 훅을 이용해 URL 파라미터 값을 가져옵니다.
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${ServerApi}/board/list/${id}`)
      .then((response) => {
        console.log(response);
        setBoardData(response.data);
        setTitle(response.data.title);
        setText(response.data.text);
        setWriter(response.data.writer);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const updatedBoardData = {
      title: title,
      text: text,
      writer: writer,
    };
    axios
      .put(`${ServerApi}/board/list/${id}`, updatedBoardData)
      .then((response) => {
        console.log(response);
        navigate(`/board/list`);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteClick = (event) => {
    event.preventDefault();
    axios
      .delete(`${ServerApi}/board/list/${id}`)
      .then((response) => {
        console.log(response);
        navigate("/board/list");
      })
      .catch((error) => console.log(error));
  };

  const handlePostChange = (event, editor) => {
    const data = editor.getData();
    setText(data.replace(/(<([^>]+)>)/gi, ""));
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
      <div className="page-header" style={{ backgroundImage: `url(${bg2})` }}>
        <h2>게시판</h2>
      </div>
      {isEditing ? (
        // 수정 폼
        <div className="parent-container">
          <div className="form-container">
            <form onSubmit={handleEditSubmit}>
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
                value={writer}
                disabled={true}
                onChange={(e) => setWriter(e.target.value)}
              />
              <CKEditor
                editor={ClassicEditor}
                config={editorConfiguration}
                data={text}
                onChange={handlePostChange}
              />
              <button type="submit">수정 완료</button>
            </form>
          </div>
        </div>
      ) : (
        // 상세 정보
        <table className="detail">
          <tbody>
            <tr>
              <td className="title-cell">{boardData.title}</td>
            </tr>
            <tr>
              <td className="info-cell">
                {boardData.writer} | {boardData.date}
              </td>
            </tr>
            <tr>
              <td>
                <div className="text-container">
                  <div
                    dangerouslySetInnerHTML={{ __html: boardData.text }}
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {isEditing ? null : (
        <div style={{ display: "block", justifyContent: "center" }}>
          <button onClick={() => setIsEditing(true)}>수정하기</button>
          <button onClick={handleDeleteClick}>삭제하기</button>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
