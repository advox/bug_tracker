const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(
    'mongodb://localhost/bug_tracker',
    {
        server: {
            socketOptions: {
                keepAlive: 30000000,
                connectTimeoutMS: 30000000,
                socketTimeoutMS: 30000000
            }
        }
    }
);

module.exports = mongoose;
