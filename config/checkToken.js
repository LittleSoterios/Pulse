
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
  //check for the token being sent in a header or as a query parameter
  let token = req.get('Authorization') || req.query.token
  if(token) {
    //remove the 'Bearer ' of ot was inlcuded in the token header
    token = token.replace('Bearer ', '')
    //check if the token is valid and not expired
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      //if valud token, decoded will be the token's entire payload
      // if the token is invalid err will be set
      req.user = err ? null : decoded.user
      // if your app cares.. (optional)
      req.exp = err ? null : new Date(decoded.exp * 1000)
      return next()
    })

  } else {
    //no token was sent 
    req.user = null
    return next()
  }

}