

module.exports = function(req, res, next){
  // Status code of 401 for unauthorized
  if(req.user) return res.status(401).json('Unauthorized')
  // user is logged in
  next()

}