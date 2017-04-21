const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(
    'mongodb://localhost/bug_tracker',
    {
        server: {
            socketOptions: {
                keepAlive: 300000,
                connectTimeoutMS: 30000
            }
        }
    }
);

module.exports = mongoose;
