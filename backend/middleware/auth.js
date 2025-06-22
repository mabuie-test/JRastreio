const jwt = require('jsonwebtoken');
module.exports = (req,res,next) => {
  const h = req.headers.authorization||'';
  if (!h.startsWith('Bearer ')) return res.status(401).json({error:'Não autenticado'});
  try {
    req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({error:'Token inválido'});
  }
};
