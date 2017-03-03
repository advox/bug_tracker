const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bug_tracker');

module.exports = mongoose;
