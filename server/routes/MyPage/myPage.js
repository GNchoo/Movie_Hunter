const express = require("express");
const router = express.Router();

// MongoDB 연결
const mongodb = require("../../db/db");
mongodb.connect();

router.get("/", (req, res) => {
  console.log("my page");
});

router.put("/user", (req, res) => {
  const updatedUSerdData = req.body;
  const db = mongodb.getDB();

  db.collection("user").updateOne(
    { username: updatedUSerdData.username },
    {
      $set: {
        name: updatedUSerdData.name,
        birth: updatedUSerdData.birth,
      },
    },
    (err, result) => {
      if (err) return console.log(err);
      console.log("회원정보 수정 완료");
      res.send(result);
    }
  );
});

router.delete("/user", (req, res) => {
  const id = req.body.id;
  const db = mongodb.getDB();
  console.log(req.body, req.data);

  db.collection("user").deleteOne({ id: id }, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log(`${id}님 회원 탈퇴 하셨습니다.`);
    res.sendStatus(204);
  });
});

module.exports = router;
