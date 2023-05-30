import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import Login from "../pages/Login";
import ChuChon from "../components/chuchon/ChuChon";
import Board from "../pages/Board";
import Sign from "../pages/Sign";
import BoardList from "../components/board/BoardList";
import BoardDetail from "../components/board/BoardDetail";
import Mypage from "../pages/Mypage";

function path() {
  return (
    <div>
      <Routes>
        <Route path="/mypage" element={<Mypage />} />
        <Route exact path="/board/list/:id" element={<BoardDetail />} />
        <Route path="/board/list" element={<BoardList />} />
        <Route path="/board" element={<Board />} />
        <Route path="/chuchon" element={<ChuChon />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/:category/search/:keyword" element={<Catalog />} />
        <Route path="/:category/:id" element={<Detail />} />
        <Route path="/:category" element={<Catalog />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default path;
