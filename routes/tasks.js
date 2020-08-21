/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const express = require('express');

const router = express.Router();
const fetch = require('node-fetch');

const User = require('../models/user');
const Task = require('../models/task');
const Game = require('../models/game');

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.auth = true;
      return next();
    }
    res.locals.auth = false;
    res.redirect('/login');
  };
}

router.use((req, res, next) => {
  req.urlWorkaround = req.protocol + '://' + req.get('host')/* + req.originalUrl*/;
  next();
});

router.get('/', authenticationMiddleware(), async function (req, res) {
  const x = await fetch(`${req.urlWorkaround}/gettasks`);
  const tasks = await x.json();
  const allTasks = tasks.slice(0, 5);
  const allTasks2 = tasks.slice(5, 10);
  res.render('tasks', { allTasks, allTasks2 });
});

router.get('/:id', async function (req, res) {
  const x = await fetch(`${req.urlWorkaround}/gettasks/${req.params.id}`);
  const task = await x.json();
  res.render('task', { taskid: task._id, exercises: task.exercises });
});

router.post('/result/:id', async function (req, res) {
  const x = req.body.result;
  const y = await fetch(`${req.urlWorkaround}/gettasks/${req.params.id}`);
  const currentTask = await y.json();
  let count = 0;
  if (x.ans1 === currentTask.exercises[0].options.correct) {
    count += 1;
  }
  if (x.ans2 === currentTask.exercises[1].options.correct) {
    count += 1;
  }
  if (x.ans3 === currentTask.exercises[2].options.correct) {
    count += 1;
  }
  if (x.ans4 === currentTask.exercises[3].options.correct) {
    count += 1;
  }
  if (x.ans5 === currentTask.exercises[4].options.correct) {
    count += 1;
  }
  const newGame = new Game({ task: req.params.id, date: new Date(), player: req.session.passport.user._id, result: count })
  await newGame.save();
  const currentUser = await User.findById(req.session.passport.user._id);
  currentUser.games.push(newGame._id);
  await currentUser.save();
  const date = newGame.date.toString().slice(0, -20);
  let comment;
  if (newGame.result === 0 || newGame.result === 1) {
    comment = 'Try again!';
  }
  if (newGame.result === 2 || newGame.result === 3) {
    comment = 'Keep it up!';
  }
  if (newGame.result === 4) {
    comment = 'Good job!';
  }
  if (newGame.result === 5) {
    comment = 'Excellent!';
  }
  res.render('stats', { name: currentUser.name, task: currentTask.title, result: newGame.result, date, comment });
});

module.exports = router;
