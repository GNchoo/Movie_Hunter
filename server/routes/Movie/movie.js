const express = require("express");
const router = express.Router();

// MongoDB 연결
const mongodb = require("../../db/db");
mongodb.connect();

// router.get(`/:id`, (req, res) => {
//   const id = parseInt(req.params.id);
//   console.log("영화 상세페이지");
// });

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
    var totalComment = result.totalComment;
    console.log(result);
    db.collection("comment").insertOne(
      {
        _id: totalComment + 1,
        movieId: id,
        text: req.body.text,
        username: req.body.username,
        writer: req.body.writer,
        sex: req.body.sex,
        age: req.body.age,
        star: parseInt(req.body.star), // 별점기능
        date: new Date().toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        }),
      },
      (err, data) => {
        console.log("한줄평 작성 완료");
        db.collection("counter").updateOne(
          { name: "comments" } /*수정할 데이터*/,
          { $inc: { totalComment: 1 } } /*$operator 필요 수정값*/,
          (err, result) => {
            if (err) {
              return console.log(err);
            }
            res.redirect("/movie/:id");
          }
        );
      }
    );
  });
});

// 한줄평 삭제
router.delete("/:id", (req, res) => {
  const _id = parseInt(req.body._id); // 이걸 프론트에서 받아와야함 어떻게 받을지는 미정
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
  const _id = parseInt(req.body._id); // 이걸 프론트에서 받아와야함 어떻게 받을지는 미정
  const updatedCommentdData = req.body;
  const db = mongodb.getDB();

  db.collection("comment").updateOne(
    { _id: _id },
    {
      // 변경되는 값은 text랑 star 만 변경
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
