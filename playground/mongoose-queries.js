const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a32c1b503c619ea213f2a20';
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then ((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo', todo);
// });

// Todo.findById(id).then ((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

var userId = '5a302ee87a9209fd22b58c11';

if (!ObjectID.isValid(userId)) {
  console.log('User ID not valid');
}

User.findById(userId).then ((user) => {
  if (!user) {
    return console.log('User ID not found');
  }
  console.log('User by Id', user);
}).catch((e) => console.log(e));
