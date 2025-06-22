const mongoose = require('mongoose');
const Tenant = new mongoose.Schema({
  name:         String,
  contactEmail: String,
  plan:         { type: String, enum:['free','basic','premium'], default:'basic' },
  createdAt:    { type: Date, default: Date.now }
});
module.exports = mongoose.model('Tenant', Tenant);
