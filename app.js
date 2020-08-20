/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sha256 = require('sha256');

const indexRouter = require('./routes/index');
const tasksRouter = require('./routes/tasks');
const apiRouter = require('./routes/api');

const app = express();

const User = require('./models/user');
const Game = require('./models/game');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({ secret: 'some key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

const loginSettings = { successRedirect: '/profile', failureRedirect: '/login' };
const signupSettings = { successRedirect: '/profile', failureRedirect: '/signup' };

passport.use('signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  await User.findOne({ email }, async function (err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      console.log('User already exists');
      return done(null, false);
    }
    const newUser = new User();
    newUser.name = req.body.name;
    newUser.password = sha256(password);
    newUser.email = email;
    newUser.date = new Date();
    await newUser.save();
    console.log('User Registration successful');
    return done(null, newUser);
  });
}));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async function (username, password, done) {
  const passwordHash = sha256(password);
  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    if (user.password !== passwordHash) {
      return done(null, false, { message: 'Wrong password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.auth = true;
      return next();
    }
    res.redirect('/home');
  };
}

app.get('/profile', authenticationMiddleware(), (req, res) => {
  const { user } = req;
  res.render('profile', { user });
});

app.get('/profile/:id/statistics', authenticationMiddleware(), async (req, res) => {
  const currentUser = await User.findById(req.session.passport.user._id).populate('games').lean();
  
  for (let i = 0; i < currentUser.games.length; i += 1) {
    const currentGame = await Game.findById(currentUser.games[i]._id).populate('task');
    currentUser.games[i].task = currentGame.task.title;
  }
  const allStat = currentUser.games;
  allStat.forEach(game => {
    game.date = game.date.toString().slice(0, -20);
  });
  res.render('profileStat', { name: currentUser.name, allStat });
});

app.get('/', authenticationMiddleware(), function(req, res) {
  res.render('index');
});

/* Получение страницы регистрации */
app.get('/signup', function (req, res) {
  res.render('register');
});
/* Обработка регистрационных POST-данных */
app.post('/signup', passport.authenticate('signup', signupSettings));

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', loginSettings));

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.use('/', indexRouter);
app.use('/tasks', tasksRouter);
app.use('/', apiRouter);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
