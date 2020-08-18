const express = require('express');

const router = express.Router();

const Task = require('../models/task');
const Sentence = require('../models/sentence');

router.get('/gettasks', async function(req, res) {
  const allTasks = await Task.find();
  res.json(allTasks);
});

router.get('/gettasks/:id', async function(req, res) {
  const currentTask = await Task.findById(req.params.id).populate('exercises');
  res.json(currentTask);
});

// router.post('/gettasks/result/:id', async function (req, res) {
//   const currentTask = await Task.findById(req.params.id).populate('exercises');
// })

module.exports = router;
