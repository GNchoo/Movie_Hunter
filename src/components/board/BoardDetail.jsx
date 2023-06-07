import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ServerApi } from "../../api/ServerApi";
import axios from "axios";
import { Editor, EditorState, convertToRaw, convertFromRaw } from "draft-js";
import bg2 from "../../assets/login-bg.jpg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./BoardDetail.scss";

const BoardDetail = () => {
  const [boardData, setBoardData] = useState({});
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [writer, setWriter] = useState("");
  const [views, setViews] = useState("");
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const _id = localStorage.getItem("id");
  const [userId, setUserId] = useState(_id);

  useEffect(() => {
    axios
      .get(`${ServerApi}/board/list/${id}`)
      .then((response) => {
        setBoardData(response.data);
        setTitle(response.data.title);
        setEditorState(
          EditorState.createWithContent(convertFromRaw(response.data.text))
        );
        setWriter(response.data.writer);
        setViews(response.data.views);
      })
      .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    setUserId(userId);
  }, [userId]);

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      alert("제목을 작성해주세요.");
      return;
    }

    const contentState = editorState.getCurrentContent();
    const updatedBoardData = {
      title: title,
      text: convertToRaw(contentState),
      writer: writer,
      username: userId,
    };
    axios
      .put(`${ServerApi}/board/list/${id}`, updatedBoardData)
      .then((response) => {
        navigate("/board/list");
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

  const handlePostChange = (editorState) => {
    setEditorState(editorState);
    const contentState = editorState.getCurrentContent();
    const contentPlainText = contentState.getPlainText("\u0001");
    setText(contentPlainText);
  };

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const backList = (event) => {
    navigate("/board/list");
  };

  console.log(boardData);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg2})` }}>
        <h2>게시판</h2>
      </div>
      {isEditing ? (
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
                  width: "80px",
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
              <span
                style={{
                  position: "relative",
                  padding: "7px",
                  border: "1px solid #fff",
                  borderRadius: "5px",
                  backgroundColor: "green",
                }}
              >
                조회수
              </span>
              <input
                style={{
                  width: "45px",
                  backgroundColor: "#333",
                  color: "#fff",
                  position: "relative",
                  zIndex: 1,
                }}
                type="text"
                name="user"
                value={views}
                disabled={true}
                onChange={(e) => setWriter(e.target.value)}
              />
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                wrapperClassName="board-wrapper"
                editorClassName="board-editor"
                onChange={handlePostChange}
              />
              <div style={{ textAlign: "center" }}>
                <button type="button" onClick={handleEditSubmit}>
                  수정 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <table className="detail">
          <tbody>
            <tr>
              <td className="title-cell">{boardData.title}</td>
            </tr>
            <tr>
              <td className="info-cell">
                {boardData.writer} | {boardData.date} | {boardData.views}
              </td>
            </tr>
            <tr>
              <td>
                <div
                  className="text-container"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {boardData.text &&
                    boardData.text.blocks &&
                    boardData.text.blocks.length > 0 && (
                      <div>
                        {boardData.text.blocks.map((block, index) => {
                          if (
                            block.type === "atomic" &&
                            block.entityRanges.length > 0
                          ) {
                            const entityKey = block.entityRanges[0].key;
                            const imageEntity =
                              boardData.text.entityMap[entityKey];
                            if (
                              imageEntity.type === "IMAGE" &&
                              imageEntity.data
                            ) {
                              return (
                                <img
                                  key={index}
                                  src={imageEntity.data.src}
                                  alt={block.text}
                                />
                              );
                            }
                          }
                          return <p key={index}>{block.text}</p>;
                        })}
                      </div>
                    )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            marginRight: "60px",
          }}
        >
          <span className="material-icons" onClick={backList}>
            list
          </span>
          <span onClick={backList}>목록으로</span>
        </div>
        {userId === boardData.username && !isEditing && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginRight: "10px",
              }}
            >
              <span
                className="material-icons"
                onClick={() => setIsEditing(true)}
              >
                edit
              </span>
              <span onClick={() => setIsEditing(true)}>수정</span>
            </div>
            <div>
              <span className="material-icons" onClick={handleDeleteClick}>
                delete
              </span>
              <span onClick={handleDeleteClick}>삭제</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;
