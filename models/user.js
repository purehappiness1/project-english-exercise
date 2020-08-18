const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: Date,
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
})

module.exports = mongoose.model('User', userSchema);
