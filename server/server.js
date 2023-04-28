const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient; // DB연결
const bcrypt = require("bcrypt"); // 패스워드 해싱
const saltRounds = 10; // salt를 생성하는데 필요한 라운드 수

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB 연결
var db;
const uri =
  "mongodb+srv://admin:1q2w3e4r@cluster0.yvz01u3.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("Movie");
    console.log("Connected to MongoDB");
    // 서버 실행
    app.listen(4000, () => {
      console.log("Server started on port 4000");
    });
  }
);
const signup = [
  {
    username: "",
    password: "",
    name: "",
  },
];
app.get("/", (req, res) => {
  console.log("??");
});

app.get("/sign", (req, res) => {
  console.log("sign request");
});

app.post("/sign", (req, res) => {
  const { username, password } = req.body;
  db.collection("user").insertOne({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    name: req.body.name,
  });
  console.log("회원가입 완료");
  res.redirect("/");
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(session({ secret: "secret", resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// 로그인하면 아이디비번 검사

app.get("/", (req, res) => {
  console.log("로그인 요청");
});

app.post(
  "/login",
  // local 방식으로 회원인증
  passport.authenticate("local", {
    // 검사하는 passport 문법
    failureRedirect: "/fail", // 실패하면 여기로 이동
  }),
  (req, res) => {
    console.log("로그인 성공"); // 성공하면 여기로 보내주세요
  }
);

// // mypage로 누가 요청하면 areYouLogin미들웨어 실행 후 코드실행
// app.get("/mypage", areYouLogin, (req, res) => {
//   console.log(req.user); // 여기에 데이터 있음
//   res.render("mypage.ejs", { 사용자: req.user });
// });

// // 미들웨어 생성
// function areYouLogin(req, res, next) {
//   // req.user(로그인 후 세션이 있으면 항상 있음)가 있으면 next() 통과
//   if (req.user) {
//     next();
//   } else {
//     res.send("로그인 안함");
//   }
// }

// 미들웨어 (요청과 응답 사이에 실행되는 코드)

// 누가 /login으로 post 요청할 때만 실행
passport.use(
  new LocalStrategy(
    {
      // 로그인후 세션에 저장할 껀지
      usernameField: "username", // form에 입력한 id
      passwordField: "password", // form에 입력한 pw
      session: false,
      passReqToCallback: false, // id, pw 말고도 다른정보 검증시 true
    },
    // 그러면 여기에 req.body. 넣어서 추가
    // 사용자 아이디와 비번 검증하는 부분
    (userId, userPassword, done) => {
      console.log(userPassword);
      // loginDB에 있는 아이디와 맞는지 확인
      db.collection("user").findOne({ username: userId }, (err, result) => {
        // 에러면 에러
        // done(서버에러, 성공시사용자DB데이터, 에러메세지)
        if (err) return done(err);
        // 아무것도 없으면 이거 실행
        if (!result) return done(null, false, "아이디 없어");
        // DB에 아이디가 있으면 입력한 비번과 result.pw와 비교
        if (bcrypt.compareSync(userPassword, result.password)) {
          return done(null, result);
        } else {
          return done(null, false, "비밀번호 틀렸어");
        }
      });
    }
  )
);

// 세션을 저장시키는 코드(로그인 성공시)
// 아이디/비번 검증 성공시 user = result
passport.serializeUser((user, done) => {
  console.log(user._id);
  done(null, user._id); // user.id에 세션을 저장
});

// 마이페이지 접속시 발동 디비에서 위에 있는 user.id로 유저를 찾은 뒤에 유저정보를 {요기에 넣음}
passport.deserializeUser((아이디, done) => {
  db.collection("login").findOne({ id: 아이디 }, (err, result) => {
    done(null, result);
  });
});
