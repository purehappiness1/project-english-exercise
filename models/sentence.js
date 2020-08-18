const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sentenceSchema = new mongoose.Schema({
  number: Number,
  body: String,
  options: {
    option1: String,
    option2: String,
    correct: String,
  },
});

module.exports = mongoose.model('Sentence', sentenceSchema);

