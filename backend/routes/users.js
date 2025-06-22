const r = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const tenant = require('../middleware/tenant');
const role = require('../middleware/role');

r.use(auth, tenant, role(['super-admin','admin']));

r.get('/', async (req,res)=>{
  const list = await User.find({tenantId:req.tenantId}, 'username role');
  res.json(list);
});

r.post('/', async (req,res)=>{
  const {username,password,role:rl} = req.body;
  const hash = await bcrypt.hash(password,10);
  const u = await User.create({
    username,passwordHash:hash,role:rl,tenantId:req.tenantId
  });
  res.status(201).json({id:u._id,username:u.username,role:u.role});
});

module.exports = r;
