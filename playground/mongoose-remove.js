const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// })



Todo.findByIdAndRemove('5a4c252cddcb501642582ac6').then((todo) => {
  console.log(result);
})
