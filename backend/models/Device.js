const mongoose = require('mongoose');
const Device = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref:'Tenant', required:true },
  imei:     { type: String, required:true, unique:true },
  label:    String,
  status:   { type: String, enum:['active','blocked'], default:'active' },
  geofence: { center:{lat:Number,lng:Number}, radius:Number },
  owner:    { type: mongoose.Schema.Types.ObjectId, ref:'User' }
});
module.exports = mongoose.model('Device', Device);
