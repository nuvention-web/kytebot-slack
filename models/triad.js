const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const triadSchema = new Schema({
  triadName: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  id: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  mentor1: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  mentor2: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  mentee: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  mentor1messages: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  mentor2messages: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  menteemessages: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
})

const Triad = mongoose.model('Triad', triadSchema);
module.exports = Triad;

// Messages are just for this triad
// Messages get reset every week
// Keep track of total messages too???
// Definitely should so we can keep track of metrics