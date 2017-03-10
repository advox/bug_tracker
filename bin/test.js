const db = require("./db");
const User = require('../models/user');
const Comment = require('../models/comment');
const Task = require('../models/task');

// Task.remove({}, function () {console.log('removed tasks')});
// User.remove({}, function () {console.log('removed users')});
// return null;

const user = new User({
    login: 'michal',
    password: 'pass',
    email: 'michalpnowicki',
    status: 1,
    group: 1,
    color: '#cccccc'
});

// user.save();


setTimeout(function() {
    User.findOne({login : 'michal'},function(err, data) {
        var task = new Task({
            status: 1,
            title: 'test task',
            content: 'test desc',
            rank: 1,
            important: 1,
            author: data._id,
            assignee: data._id,
            notifications: [],
            files: [],
        });
        task.save();
        data.tasks.push(task);
        data.save();
    });
}, 1000);

setTimeout(function() {
    Task.findOne( {title : 'test task'} )
        .populate('author assignee')
        .exec((err, data) => {
            console.log(data);
            console.log(data.title);
        });

    User.findOne({ login: 'michal' })
        .populate('tasks')
        .exec(function (err, data) {
            console.log(data);
            console.log(data.login);
        });
}, 1000);

return null;
