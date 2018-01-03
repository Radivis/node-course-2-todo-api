const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos,
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/123456789
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({todo});
    }).catch((e) => res.status(400).send());
});

app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({todo});
    }).catch((e) => res.status(400).send());

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};



// Playground code below:

// var newTodo = new Todo({
//   text: "Somestring to two"
// });

// var Todo2 = new Todo({
//   text: 'Test this shit',
//   completed: true,
//   completedAt: 123456789
// })

// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo', e);
// });

// User
// email - required, trimmed, set type, set min length of 1

// var newUser = new User({
//   email: 'test@test.de'
// });

// newUser.save().then((doc) => {
//   console.log('Saved user', doc);
// }, (e) => {
//   console.log('Unable to save user', e);
// });
