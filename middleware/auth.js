const jwt = require('jsonwebtoken');
const config = require('config');

// middleware funciton
/* has access to req/resposne objects
    callback that needs to be run when evertyhing is done
    to conitnue to next peace of middleware
*/

module.exports = function(req, res, next) {
  // Get token from the header
  // we are sending a token in this key?
  const token = req.header('x-auth-token');

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorazitaion denied!' });
  }

  // Verify the token
  try {
    // decode that token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;

    // call next method
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid!' });
  }
};
