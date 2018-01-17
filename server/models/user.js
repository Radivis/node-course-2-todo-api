const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  // console.log('this user: ', JSON.stringify(user,undefined,2));
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'a.salt').toString();

  // console.log(JSON.stringify(user,undefined, 2));

  user.tokens = user.tokens.concat([{access, token}]);
  // console.log('user.tokens: ',user.tokens); works

  return user.save().then(() => {
    //console.log(token); works
    return token;
  });
};

// The following is a model method
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'a.salt');
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject('Authentication token verification failed');
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
    })

};

var hashThen = (password, then) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      then(hashedPassword);
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    hashThen(user.password, (hash) => {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
