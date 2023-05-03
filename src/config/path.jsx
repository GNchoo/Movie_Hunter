import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import Login from "../pages/detail/Login";
import ChuChon from "../pages/detail/ChuChon";
import Board from "../pages/detail/Board";
import BoardList from "../pages/detail/BoardList";
import Sign from "./../pages/detail/Sign";

function path() {
  return (
    <div>
      <Routes>
        <Route path="/Board" element={<Board />} />
        <Route path="/Board/List" element={<BoardList />} />
        <Route path="/Board/write" element={<BoardList />} />
        <Route path="/ChuChon" element={<ChuChon />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Sign" element={<Sign />} />
        <Route path="/:category/search/:keyword" element={<Catalog />} />
        <Route path="/:category/:id" element={<Detail />} />
        <Route path="/:category" element={<Catalog />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default path;
