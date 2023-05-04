import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/body-bg.jpg";

function BoardList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 게시글 목록을 불러오는 API 호출
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div>
      <div className="page-header" style={{ backgroundImage: `url(${bg})` }}>
        <h2>게시판 목록</h2>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/board/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BoardList;
