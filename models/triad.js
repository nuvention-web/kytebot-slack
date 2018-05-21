const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const triadSchema = new Schema({
  triadName: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  mentor1: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  mentor2: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  mentee: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
})

const Triad = mongoose.model('Triad', triadSchema);
module.exports = Triad;