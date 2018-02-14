var {User} = require('../models/user');
const {log} = require('../../logging/logging');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      log(3,'Failure in function authenticate: User not found');
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    log(2,'Authentication successful for user ' + JSON.stringify(user));
    next();
  }, (error) => {
    log(3,'Authentication failed because ' + JSON.stringify(error));
    res.status(401).send()
  });
};

module.exports = {authenticate};
