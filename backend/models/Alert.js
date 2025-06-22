const mongoose = require('mongoose');
const Alert = new mongoose.Schema({
  device:    { type: mongoose.Schema.Types.ObjectId, ref:'Device' },
  type:      String,  // e.g. 'GEOFENCE_OUT'
  data:      mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Alert', Alert);
