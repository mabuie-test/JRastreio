module.exports = (io) => {
  const r = require('express').Router();
  const Device = require('../models/Device');
  const User   = require('../models/User');
  const auth   = require('../middleware/auth');
  const tenant = require('../middleware/tenant');
  const role   = require('../middleware/role');

  r.use(auth);

  // CREATE
  r.post('/', role(['super-admin','admin']), async (req,res)=>{
    // como antes...
  });

  // LIST all authenticated
  r.get('/', tenant, async (req,res)=>{
    // como antes...
  });

  // GET one
  r.get('/:id', tenant, async (req,res)=>{
    // como antes...
  });

  // UPDATE
  r.put('/:id', role(['super-admin','admin']), tenant, async (req,res)=>{
    // como antes...
  });

  return r;
};
