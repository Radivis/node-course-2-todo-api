// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// var user = {name: 'andrew', age: 25};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Users').findOneAndUpdate({
    name: 'James Hrenka'
  }, {
    $set: {name: 'Michael Hrenka'},
    $inc: {age: 1}
  }, {
      returnNewDocument: true
    })
  .then((result) => {
    console.log(result);
  });

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a2eb997a8544647612aa62b')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //     returnNewDocument: true
  //   })
  // .then((result) => {
  //   console.log(result);
  // });

  // db.close();
});
