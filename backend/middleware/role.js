module.exports = (roles) => (req,res,next) => {
  const r = req.user.role;
  const allowed = Array.isArray(roles)?roles:[roles];
  if (!allowed.includes(r)) return res.status(403).json({error:'Permissão negada'});
  next();
};
