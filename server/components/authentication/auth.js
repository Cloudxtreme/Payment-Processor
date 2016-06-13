import config from '../../config/environment';
var jwt = require('jwt-simple');
var User = require('../../api/user/user.model');
var secretKey = config.secrets.session;

export function isAuthenticated(req,res,next) {
  try {
    var token = req.headers['x-auth'];
    var auth = jwt.decode(token, secretKey);
    User.findOneAsync({username: auth.username})
    .then(function(user) {
      req.user = user;
      next();
    });
  } catch(err) {
    return res.sendStatus(401);
  }
}
