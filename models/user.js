const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const userSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  name: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  messages: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  totalMessages: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  lastWeeksMessages: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  links: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  images: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  lastMessage: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
})

const User = mongoose.model('User', userSchema);
module.exports = User;

// Last weeks messages stores all the last weeks messages. Restarts every week
// messages are this week's messages (live)
// totalMessages are total messages sent ever
// links and images are links and images that a user has sent
// user is the id
