var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var notices = require('./routes/notices');
var reviews = require('./routes/reviews');
var estimates = require('./routes/estimates');
var companies = require('./routes/companies');
var likes = require('./routes/likes');
var customers = require('./routes/customers');
var requests = require('./routes/requests');
var agents = require('./routes/agents');
var faqs = require('./routes/faqs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 모듈 설정 - 필수
var session = require('express-session');
app.use(session({
    secret: 'Secret Key',
    resave: false,
    saveUninitialized: false
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var defaultUser = {
    id: 'user',
    password: '1234',
    name: '사용자'
}

// Local Strategy
var LocalStrategy = require('passport-local').Strategy;
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
app.get('/login', function (req, res) {
    console.log('authorized : ', req.isAuthenticated());
    res.status(200).send('authorized : '+ req.isAuthenticated());
});

// 로그인 요청
app.post('/login', passport.authenticate('local'));

app.get('/myHome', isAuthenticated, function (req, res) {
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
app.get('/logout', function (req, res) {
    console.log('로그아웃');
    req.logout();
    res.redirect('/login');
});

app.get('/', function (req, res) {
    res.redirect('/login');
})



app.use('/', index);
app.use('/users', users);
app.use(notices);
app.use(reviews);
app.use(estimates);
app.use(companies);
app.use(likes);
app.use(customers);
app.use(requests);
app.use(agents);
app.use(faqs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
