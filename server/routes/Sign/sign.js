const express = require("express");
const router = express.Router();
const mongodb = require("../../db/db");
const bcrypt = require("bcrypt"); // 패스워드 해싱

const saltRounds = 10; // salt를 생성하는데 필요한 라운드 수

mongodb.connect(); // MongoDB 연결

router.get("/sign", (req, res) => {
  console.log("sign request");
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const db = mongodb.getDB();

  db.collection("user")
    .find({ username: req.body.username }) // 입력한 id와 db에 저장된 id 검사
    .toArray((err, results) => {
      if (results.length > 0) {
        // 결과값이 1 이상일 경우 이미 있는 id
        console.log("이미 등록된 아이디");
        res.redirect("/sign");
      } else {
        // 등록된 id가 없다면 회원가입 진행
        db.collection("user").insertOne({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, saltRounds),
          name: req.body.name,
          birth: req.body.birth,
          sex: req.body.sex,
        });
        console.log("회원가입 완료");
        res.redirect("/");
      }
    });
});

module.exports = router;
