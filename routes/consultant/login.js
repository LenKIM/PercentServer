
module.exports = function (app, passport) {

    /**
     * passport 설정
     */
    app.post('/agent/login',
        passport.authenticate('local-login',
            {
                failureFlash: true
            }),
        function (req, res) {
            // TODO 세션 저장 설정
            res.status(202).send({msg:"Success Log-in"})
        });

    app.post('/agent/signup',
        passport.authenticate('local-signUp',
            {
                failureFlash: true
            }), function (req, res) {
            res.status(202).send({msg : "Success Sign-up"})
        });

    app.get('/agent/logout', function (req, res) {
        req.logout();
        res.send({msg : "Logout."})
    })
};