const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var User = mongoose.model('User', UserSchema);

module.exports = {User};
