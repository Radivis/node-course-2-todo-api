// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// var user = {name: 'andrew', age: 25};
// var {name} = user;
// console.log(name);

const deleteByID = (ID, collection) => {
  MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server to delete by ID');

  db.collection(collection)
  .findOneAndDelete({_id: ID})
  .then((result) => {
     console.log(`Deleted by ID ${ID}: ${result}`);
    });

  });
};

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // findDuplicates
  let toDelete = [];
  let names = [];

  db.collection('Users').find().toArray()
  .then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
    docs.forEach((doc) => {
      if (names.indexOf(doc.name) !== -1) {
        toDelete.push(doc._id); // If name already exists, deleteByID
      } else {
        names.push(doc.name); // otherwise, just remember name
      }
    });

    console.log(toDelete, names);

    toDelete.forEach(id => deleteByID(id, 'Users'));
  }, (err) => {
    console.log('Unable to fetch users', err);
  });


  // db.close();
});
