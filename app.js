/******************************\
SET DEBUG=troop-87:* & npm start
\******************************/
/******************\
mongod --dbpath=data
\******************/
/***********************************************\
C:\Users\shivr\Programming\Sites\Current\troop-87
\***********************************************/

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

var config = require('./config');
mongoose.connect(config.mongoURI);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

var records = [
  { id: 1, username: config.username, password: config.password }
];
var findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}
var findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
passport.use(new Strategy(
  function(username, password, cb) {
    findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
  findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

//require routes
var index = require('./routes/index');
var members = require('./routes/members');
app.use('/', index);
app.use('/members', members);

//error handling at the bottom of the pipeline
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

module.exports = app;