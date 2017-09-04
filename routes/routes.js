var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/',
  function(req, res) {
    res.render('index', { title: 'Express', user: req.user });
  });

router.get('/login',
  function(req, res){
    res.render('501');
  });
  
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/members',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('members', { user: req.user });
  });

module.exports = router;