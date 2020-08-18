const express = require('express');

const router = express.Router();
const sha256 = require('sha256');
const User = require("../models/user");
/* GET home page. */
function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.auth = true;
      //res.redirect('/home');
      return next();
    }
    res.locals.auth = false;
    res.redirect('/home');
  };
}

// router.get('/', authenticationMiddleware(), function(req, res) {
//   res.render('index');
// });

router.get('/home', function(req, res) {
  res.render('index');
});

module.exports = router;
