const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/english', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/user');
const Task = require('./models/task');
const Sentence = require('./models/sentence');

// async function writeTask(task) {
// try {
// const newTask = new Task(task);
// await newTask.save();
// } catch (err) {
// console.log(err);
// }
// }

// writeTask({ title: 'House' });

async function writeSen(sentence) {
try {
const newSentence = new Sentence(sentence);
await newSentence.save();
const currentTask = await Task.findOne({ title: 'Fruits' });
await currentTask.exercises.push(newSentence.id);
currentTask.save();
} catch (err) {
console.log(err);
}
}

writeSen({ number: 5, body: 'It is very hard on the outside, but soft and yellow on the inside', options: { option1: 'mango', option2: 'pineapple', correct: 'pineapple' } });
