const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  messages: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  links: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  images: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  : {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
})

const User = mongoose.model('User', userSchema);
module.exports = User;