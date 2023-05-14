const express = require("express");
const router = express.Router();

// MongoDB 연결
const mongodb = require("../../db/db");
mongodb.connect();

router.get(`/:id`, (req, res) => {
  console.log("영화 상세페이지");
});

// 영화 한줄평 목록
router.get("/:id/comment", (req, res) => {
  const id = req.params.id;
  const db = mongodb.getDB();

  db.collection("comment")
    .find({ movieId: id })
    .toArray((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
});

// 영화 한줄평 등록
router.post(`/:id/comment/add`, (req, res) => {
  const id = req.params.id; // 클라이언트 요청에서 id 값을 추출

  const db = mongodb.getDB();

  db.collection("comment").insertOne({
    movieId: id,
    text: req.body.text,
    writer: req.body.user,
    sex: "미정",
    birth: parseInt("2023" - "미정"),
    start: parseInt("미정"), // 별점기능
    date: new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    }),
  });
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/movie/:id/comment");
  };
});

module.exports = router;
