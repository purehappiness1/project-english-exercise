const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  title: String,
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Sentence' }],
});

module.exports = mongoose.model('Task', taskSchema);
