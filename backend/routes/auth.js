const r = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// register
r.post('/register', async (req,res)=>{
  const {username,password,role,tenantId} = req.body;
  const hash = await bcrypt.hash(password,10);
  const u = await User.create({username,passwordHash:hash,role,tenantId});
  res.status(201).json({id:u._id,username:u.username});
});

// login
r.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const u = await User.findOne({username});
  if(!u||!await bcrypt.compare(password,u.passwordHash))
    return res.status(401).json({error:'Credenciais inválidas'});
  const token = jwt.sign({
    id: u._id,
    role: u.role,
    tenantId: u.tenantId
  }, process.env.JWT_SECRET, {expiresIn:'1d'});
  res.json({token});
});

module.exports = r;
