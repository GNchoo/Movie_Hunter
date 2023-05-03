import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router";
import axios from "axios";
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

    // API call to send new post to server
    axios
      .post("/api/posts", { content: newPost })
      .then((response) => {
        // API call to load the post list again
        axios.get("/api/posts").then((response) => {
          setPosts(response.data);
          navigate("/board-list"); // Move to the BoardList page when writing is complete
        });
      })
      .catch((error) => console.log(error));

    setNewPost("");
  };

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>게시판</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <CKEditor editor={ClassicEditor} onChange={handlePostChange} value={newPost} />
        <button type="submit">글쓰기</button>
      </form>
    </div>
  );
}

export default Board;
