/**
 * 로컬 인증 방식의 패스포트 사용
 */
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./mysql');



module.exports = function(passport) {

    /**
     * 세션 저장 용도
     */
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    //used to
    passport.deserializeUser(function (id, done) {
        pool.getConnection().then(conn => {
            const sql = 'SELECT * FROM agent AS as WHERE agent_id =?';
            conn.query(sql, [id]).then( results => {
                console.log(results);
            }).catch(err => {
                done(err);
            })
        })
    });

    /**
     * Local Sign-up 정의
     */
    passport.use('local-signUp', new LocalStrategy({
            usernameField : 'agent_id',
            passwordField : 'password',
            passReqToCallback : true
        },
        function (req, email, password, done) {
            //Find a agent user If email is existed
            pool.getConnection().then(conn => {
                const verifySql = 'SELECT * FROM agent WHERE agent_id =?';
                conn.query(verifySql, [email]).then( results => {
                    console.log(results);

                    if(results.length){
                        return done({msg : "아이디가 이미 존재합니다."});
                    } else {

                        const object = {};
                        object.email = email;
                        object.password = password;

                        const insertSql = 'INSERT INTO agent (agent_id, password, name, register_number, fcm_token) values(?,?,?,?,?)';
                        conn.query(insertSql, [email, password, req.body.name, req.body.register_number, req.body.fcm_token]).then( registrationResults => {
                            console.log(registrationResults);
                            object.id = registrationResults.insertId;
                            console.log("데이터베이스에 회원정보 등록완료");
                            return done(null, object);
                        });
                    }
                });
            });
        }));

    /**
     * 로컬 로깅 verify 정의
     */
    passport.use('local-login', new LocalStrategy({
            usernameField: 'agent_id',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            pool.getConnection().then(conn => {
                const findSql = 'SELECT * FROM agent WHERE agent_id =?';
                conn.query(findSql, [email]).then(oneId => {
                    if(!oneId.length){
                        return done(null, false);
                    }
                    if(!(oneId.password === password)){
                        return done(null,false);
                    }
                    return done(null, oneId);
                });
            }).catch(err => {
                console.log(err);
            });
        }));
};