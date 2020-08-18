const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new mongoose.Schema({
  task: { type: Schema.Types.ObjectId, ref: 'Task' },
  date: Date,
  player: { type: Schema.Types.ObjectId, ref: 'User' },
  result: Number,
});

module.exports = mongoose.model('Game', gameSchema);
