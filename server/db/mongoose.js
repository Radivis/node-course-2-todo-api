const mongoose = require('mongoose');

// Mongoose config
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAoo');

module.exports = {mongoose};
