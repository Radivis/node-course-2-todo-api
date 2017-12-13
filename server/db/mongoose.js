const mongoose = require('mongoose');

// Mongoose config
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoAoo');

module.exports = {mongoose};
