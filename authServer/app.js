var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'sh';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    done(null, jwt_payload);
}));

var app = express();

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'sh';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = {
        name: jwt_payload.name
    };

    next(null, user);
});

passport.use(strategy);

passport.use(new Strategy(
    function(username, password, cb) {
            console.log(username+password);
            var user = {
                name : username,
                password : password
            };
            return cb(null, user);
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user.name);
});

passport.deserializeUser(function(name, cb) {
        var user = {};
        user.name = name;
        user.status="angemeldet";
        cb(null, user);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
    function(req, res) {
    if(req.user){
        res.send("Hallo "+ req.user.name);
    }
    else{
        res.send("Hallo Fremder");
    }
    });

app.get('/login',
    function(req, res) {
        res.send("loginpage");
    });

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
        res.send("Hallo "+req.user.name+"! Dein Token: "+jwt.sign({ name: req.user.name }, 'sh'));
    });

app.post("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json("Success! You can not see this without a token");
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(3000, function () {
    var port = server.address().port;

});
