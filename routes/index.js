const express = require('express');
const session = require('express-session');
const passport = require('passport');
const router = express.Router();

const defaultUser = {
    id: 'user',
    password: '1234',
    name: '사용자'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use(session({
    secret: 'Secret Key',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
// Local Strategy
const LocalStrategy = require('passport-local').Strategy;
var strategy = new LocalStrategy({ passReqToCallback: true },
    function (req, username, password, done) {
        console.log(username + " " + password);
        if (username == defaultUser.id && password == defaultUser.password) {
            console.log('로그인 성공');
            return done(null, defaultUser);
        }
        console.log('로그인 실패');
        return done(null, false, { message: '로그인 실패' });
    }
);
passport.use(strategy);

// 세션에 기록하기
passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user); // Session에 user 정보 기록
});

// 세션에서 사용자 정보 얻어오기
passport.deserializeUser(function (user, done) {
    //serializeUser에서 user를 세션에 저장했으므로 user 정보가 전달된다.
    console.log('deserializeUser', user);
    done(null, user);
});

// 로그인 페이지
router.get('/login', function (req, res) {
    console.log('authorized : ', req.isAuthenticated());
    res.status(200).send('authorized : '+ req.isAuthenticated());
});

// 로그인 요청
router.post('/login', passport.authenticate('local'));

router.get('/myHome', isAuthenticated, function (req, res) {
    // 인증된 상태이므로 myHome 템플릿 페이지 렌더링
    res.render('myHome', { user: req.user });
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // 인증된 상태면 다음 미들웨어 실행
        return next();
    }
    // 인증된 상태가 아니면 /login로 이동
    res.redirect('/login');
}

// 로그아웃
router.get('/logout', function (req, res) {
    console.log('로그아웃');
    req.logout();
    res.redirect('/login');
});

router.get('/', function (req, res) {
    res.redirect('/login');
});

module.exports = router;
