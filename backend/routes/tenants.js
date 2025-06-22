const r = require('express').Router();
const Tenant = require('../models/Tenant');
const User   = require('../models/User');
const auth   = require('../middleware/auth');
const role   = require('../middleware/role');

r.use(auth, role('super-admin'));

r.post('/', async (req,res)=>{
  const {name,contactEmail,plan,adminUserId} = req.body;
  const t = await Tenant.create({name,contactEmail,plan});
  await User.findByIdAndUpdate(adminUserId,{
    role:'admin',tenantId:t._id
  });
  res.status(201).json(t);
});

r.get('/', async(_,res)=>{
  const list = await Tenant.find();
  res.json(list);
});

module.exports = r;
