import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import Login from "../pages/detail/Login";
import ChuChon from "../pages/detail/ChuChon";
import Board from "../pages/detail/Board";
import SignForm from "../components/Sign/SignForm";

function rou() {
  return (
    <div>
      <Routes>
        <Route path="/Board" element={<Board />} />
        <Route path="/ChuChon" element={<ChuChon />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignForm" element={<SignForm />} />
        <Route path="/:category/search/:keyword" element={<Catalog />} />
        <Route path="/:category/:id" element={<Detail />} />
        <Route path="/:category" element={<Catalog />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default rou;
