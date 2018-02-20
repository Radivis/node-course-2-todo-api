const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {log} = require('../../logging/logging');

// {
//   email: 'andrew@example.com',
//   password: 'gdsgdfhtzjgzkjtzikjgz',
//   tokens: [{
//     access: 'auth',
//     token: 'twetwetwt3tjw'
//   }]
// }

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 12
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  }/*,
   {
     usePushEach: true
   }*/);

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// The following is an instance method
UserSchema.methods.generateAuthToken = function () {
  var user = this;

  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'a.salt').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
};

// The following is a model method
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'a.salt');
    // log('decoded variable is ' + JSON.stringify(decoded));
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    log(3,'Error in function User.findByToken: User authentification failed. Reason: ' + JSON.stringify(e));
    return Promise.reject('Authentication token verification failed, because: ' + JSON.stringify(e));
  }
  log(2,'decoded variable is ' + JSON.stringify(decoded));

  log('Success of function User.findByToken: User authentification succeeded for user ' + JSON.stringify(decoded));

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      log(1,'Password is' + password + '. Hashed password is: ' + user.password);
      bcrypt.compare(password, user.password, function(err, res) {
        if (res === true) {
          log(2,'Password ' + password + ' does evaluate to hashed password ' + user.password);
          resolve(user);
        } else {
          log(3,'Password ' + password + ' does not evaluate to hashed password ' + user.password);
          reject(err);
        }
      });
    });
  });
};

var hashThen = (password, then) => {
  bcrypt.genSalt(10, (err, salt) => {
    // log('Generating Salt ' + salt);
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      // log('Generating hashed password ' + hashedPassword + ' from password ' + password);
      then(hashedPassword);
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  // log('Pre saving method called for user ' + user);

  if (user.isModified('password')) {
    hashThen(user.password, (hash) => {
      log('user password ' + user.password + ' hashed to ' + hash);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
