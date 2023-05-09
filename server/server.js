const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient; // DB연결
const bcrypt = require("bcrypt"); // 패스워드 해싱
const saltRounds = 10; // salt를 생성하는데 필요한 라운드 수

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

app.get("/home", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("/home", { user: req.user });
  } else {
    res.redirect("/login");
  }
});
app.get("/sign", (req, res) => {
  console.log("sign request");
});

app.post("/sign", (req, res) => {
  const { username, password } = req.body;
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
        res.redirect("/home");
      }
    });
});

// 로그인하면 아이디비번 검사

app.get("/login", (req, res) => {
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
    console.log("로그인 성공");
    // 성공하면 여기로 보내주세요
    console.log(req.user);
    res.json({ user: req.user });
  }
);

// // mypage로 누가 요청하면 areYouLogin미들웨어 실행 후 코드실행
// app.get("/mypage", areYouLogin, (req, res) => {
//   console.log(req.user); // 여기에 데이터 있음
//   res.render("mypage.ejs", { 사용자: req.user });
// });

// 미들웨어 생성
// 로그인한 사용자만 게시물 작성 가능하도록 인증

// 미들웨어 (요청과 응답 사이에 실행되는 코드)

// 누가 /login으로 post 요청할 때만 실행
passport.use(
  new LocalStrategy(
    {
      // 로그인후 세션에 저장할 껀지
      usernameField: "username", // form에 입력한 id
      passwordField: "password", // form에 입력한 pw
      session: true,
      passReqToCallback: false, // id, pw 말고도 다른정보 검증시 true
    },
    // 그러면 여기에 req.body. 넣어서 추가
    // 사용자 아이디와 비번 검증하는 부분
    (userId, userPassword, done) => {
      console.log(userPassword, userId);
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
  console.log(user);
  done(null, user.username); // user.username에 세션을 저장
});

// 마이페이지 접속시 발동 디비에서 위에 있는 user.id로 유저를 찾은 뒤에 유저정보를 {요기에 넣음}
passport.deserializeUser((username, done) => {
  db.collection("user").findOne({ username: username }, (err, result) => {
    console.log(err);
    console.log(result);
    done(null, result);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// 게시판
app.get("/board", (req, res) => {
  console.log("게시판 입장");
});

app.get("/board/list", (req, res) => {
  db.collection("board")
    .find()
    .toArray((err, result) => {
      console.log(result);
      console.log("게시판 리스트");
      res.redirect("/board/list");
    });
});

// app.get("saffsa", ensureAuthenticated, (req, res) => {
//   db.collection("user")
//     .find()
//     .toArray((err, result) => {
//       // console.log(result);
//       res.redirect("/board/list" /*{ info: result }*/);
//     });
// });

app.post("/board/add", (req, res) => {
  // db에 있는 counter라는 컬렉션을 찾고 그 안에 있는 Posts를 찾고 Posts를 변수에 저장
  db.collection("counter").findOne({ name: "posts" }, (err, result) => {
    var totalPost = result.totalPost;
    // db에 있는 post라는 컬렉션에 id, title, date를 넣어줌
    db.collection("board").insertOne(
      {
        _id: totalPost + 1,
        title: req.body.title,
        text: req.body.text,
        writer: req.body.user, // 게시판 작성자 추가
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
            res.redirect("/board/list" /*{ writer: req.user.writer }*/);
          }
        );
      }
    );
  });
});
