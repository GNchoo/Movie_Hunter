const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../passport/passport");
const session = require("express-session");

// MongoDB 연결
const mongodb = require("../../db/db");
mongodb.connect();

router.get("/", (req, res) => {
  console.log("로그인 요청");
});

router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

router.use(passport.initialize());
router.use(passport.session());

router.post(
  "/",
  // local 방식으로 회원인증
  passport.authenticate("local", {
    // 검사하는 passport 문법
    failureRedirect: "/fail", // 실패하면 여기로 이동
  }),
  (req, res) => {
    console.log("로그인 성공");
    console.log(req.user);
    res.json({ user: req.user });
  }
);

module.exports = router;
