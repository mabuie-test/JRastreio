const mongoose = require('mongoose');
const Track = new mongoose.Schema({
  device:    { type: mongoose.Schema.Types.ObjectId, ref:'Device' },
  latitude:  Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Track', Track);
