const express = require("express");
const router = express.Router();

// MongoDB 연결
const mongodb = require("../../db/db");
mongodb.connect();

router.get(`/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  console.log("영화 상세페이지");
});

// 영화 한줄평 목록
router.get("/:id", (req, res) => {
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
router.post(`/:id/add`, (req, res) => {
  const id = req.params.id; // 클라이언트 요청에서 id 값을 추출

  const db = mongodb.getDB();
  db.collection("counter").findOne({ name: "comments" }, (err, result) => {
    var totalPost = result.totalPost;

    db.collection("comment").insertOne({
      _id: totalPost + 1,
      movieId: id,
      text: req.body.text,
      writer: req.body.user,
      // sex: "미정",
      // birth: parseInt("2023" - "미정"),
      // star: parseInt("미정"), // 별점기능
      date: new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      }),
    });
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      res.redirect("/movie/:id");
    };
  });
});

router.delete("/:id", (req, res) => {
  const _id = parseInt(req.body._id);
  const db = mongodb.getDB();

  db.collection("comment").deleteOne({ _id: _id }, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(`삭제되었습니다.`);
    res.sendStatus(204); // 클라이언트에게 성공적으로 처리되었음을 알립니다.
  });
});

router.put("/:id", (req, res) => {
  const _id = parseInt(req.body._id);
  const updatedCommentdData = req.body;
  const db = mongodb.getDB();

  db.collection("comment").updateOne(
    { _id: _id },
    {
      $set: {
        text: updatedCommentdData.text,
        star: updatedCommentdData.start,
      },
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log("글 수정 완료");
      res.send(result);
    }
  );
});

module.exports = router;
