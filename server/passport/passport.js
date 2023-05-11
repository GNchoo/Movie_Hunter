require("events").EventEmitter.defaultMaxListeners = 15;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt"); // 패스워드 해싱

const mongodb = require("../db/db");
mongodb.connect(); // MongoDB 연결

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
      const db = mongodb.getDB();
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
  const db = mongodb.getDB();
  db.collection("user").findOne({ username: username }, (err, result) => {
    console.log(err);
    console.log(result);
    done(null, result);
  });
});
