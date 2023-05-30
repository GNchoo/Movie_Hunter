const express = require("express");
const router = express.Router();

// MongoDB 연결
const mongodb = require("../../db/db");
mongodb.connect();

router.get("/", (req, res) => {
  console.log("게시판 입장");
});

// 게시글 목록 불러오기
router.get("/list", (req, res) => {
  const db = mongodb.getDB();

  db.collection("board")
    .find()
    .toArray((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
});

// 게시글상세 페이지 불러오기
router.get("/list/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = mongodb.getDB();

  db.collection("board").updateOne(
    { _id: id },
    { $inc: { views: 1 } },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else if (!result.modifiedCount) {
        res.status(404).send("게시물을 찾을 수 없습니다.");
      } else {
        db.collection("board").findOne({ _id: id }, (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else if (!result) {
            res.status(404).send("게시물을 찾을 수 없습니다.");
          } else {
            res.status(200).send(result);
          }
        });
      }
    }
  );
});

// 게시글 수정
router.put("/list/:id", (req, res) => {
  const { id } = req.params;
  const updatedBoardData = req.body;
  const db = mongodb.getDB();

  db.collection("board").updateOne(
    { _id: Number(id) },
    {
      $set: {
        title: updatedBoardData.title,
        text: updatedBoardData.text,
        writer: updatedBoardData.writer,
        username: updatedBoardData.username,
      },
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log("글 수정 완료");
      console.log(req.params);
      res.send(result);
    }
  );
});

// 게시글 삭제
router.delete("/list/:id", (req, res) => {
  const id = parseInt(req.params.id); // URL 파라미터로부터 게시글 ID를 가져옵니다.
  const db = mongodb.getDB();

  db.collection("board").deleteOne({ _id: id }, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(`게시글 ${id}이(가) 삭제되었습니다.`);
    res.sendStatus(204); // 클라이언트에게 성공적으로 처리되었음을 알립니다.
  });
});
// 게시글 댓글
router.post("list/:id/add", (req, res) => {
  const id = parseInt(req.params.id);
  const db = mongodb.getDB();

  db.collection("board").findOne({ _id: id }, (err, result) => {
    const boardId = result._id;
    db.collection("boardComments").insertOne({
      boardId: boardId,
      text: req.body.text,
      username: req.body.username,
    });
  });
});

// 게시글 작성
router.post("/add", (req, res) => {
  const db = mongodb.getDB();

  // db에 있는 counter라는 컬렉션을 찾고 그 안에 있는 Posts를 찾고 Posts를 변수에 저장
  db.collection("counter").findOne({ name: "posts" }, (err, result) => {
    var totalPost = result.totalPost;
    // db에 있는 post라는 컬렉션에 id, title, date를 넣어줌
    db.collection("board").insertOne(
      {
        _id: totalPost + 1,
        title: req.body.title,
        text: req.body.text,
        username: req.body.userId, // 고유 id 값 구분
        writer: req.body.user, // 게시판 작성자 추가
        date: new Date().toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        }), // 작성일 추가
      },
      // 위에 코드가 완료가 되면 db에 있는 counter 안에 있는 Posts를 수정해줌
      (err, data) => {
        console.log("저장완료");
        console.log(req.body.user);
        db.collection("counter").updateOne(
          { name: "posts" } /*수정할 데이터*/,
          { $inc: { totalPost: 1 } } /*$operator 필요 수정값*/,
          (err, result) => {
            if (err) {
              return console.log(err);
            }
            res.redirect("/board/list");
          }
        );
      }
    );
  });
});

module.exports = router;
