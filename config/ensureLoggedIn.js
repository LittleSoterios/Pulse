const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
  // Status code of 401 for unauthorized
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user.user
    next()
  });
}