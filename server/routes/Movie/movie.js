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

router.post("/:id/like", (req, res) => {
  const movieId = req.params.id;
  const userId = req.body.username;

  const db = mongodb.getDB();

  db.collection("user").findOne({ username: userId }, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    // 사용자를 찾을 수 없을때
    if (!user) {
      return res.status(404);
    }
    // 이미 좋아요한 영화 일때
    if (user.likes.includes(movieId)) {
      return res.status(400);
    }

    db.collection("user").updateOne(
      { username: userId },
      { $push: { likes: movieId } },
      (err) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        console.log(`${userId}가 ${movieId}를 좋아요하셨습니다.`);
        return res.sendStatus(204);
      }
    );
  });
});

module.exports = router;
