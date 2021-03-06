const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'a.salt';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$4RihzJ8S/rXzMyiBtzImuuEzG.gyaLMWUNZRTMC24PenyumQ7J/OC';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});


// var data = {
//   id: 10
// };
// var secret = '123abc';
//
// var token = jwt.sign(data, secret);
// console.log(token);
//
// var decoded = jwt.verify(token, secret);
// console.log('decoded', decoded);


// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// JSON Web Token playground code:

// var salt = 'somesecret';
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + salt).toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString;
//
//
// var resultHash = SHA256(JSON.stringify(data) + salt).toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Date was changed. Do not trust!');
// }
