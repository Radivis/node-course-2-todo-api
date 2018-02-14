const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const {log} = require('../../../logging/logging');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}, {
  _id: new ObjectID(),
  text: 'Third test todo'
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass!!!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'a.salt').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass!!!'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() =>{
    return Todo.insertMany(todos);
  }).then(() => done());
};


// PopulateUsers seems to have problems actually storing users in the Database. Why???
const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => {
    log('Users have been saved by function populateUsers');
    done()}
    ,(e) => {
      log(4,'Error occurred in function populateUsers: ' + JSON.stringify(e));
      return e; done();}
    );
};

module.exports = {todos, populateTodos, users, populateUsers};
