const db = require("./db");
const User = require('../models/user');
const Comment = require('../models/comment');
const Task = require('../models/task');

// Task.remove({}, function () {console.log('removed tasks')});
// User.remove({}, function () {console.log('removed tasks')});

var mc = new User({
    login: 'maciej',
    password: 'xxx',
    email: 'mmbozek',
    status: 1,
    group: 1,
    color: 'cccccc'
});

// mc.save((err) => {
//     console.log(err)
// });

User.findOne({login:'maciej'}, (err, user) => {
    var tc = new Task({
        status: 1,
        title: 'test',
        description: 'cvc',
        rank: 1,
        important: 1,
        author: user._id,
        assignee: user._id,
        notifications: [],
        files: [],
    });
    // tc.save();
    // user.tasks.push(tc);
});

Task.findOne({title:'test'})
    .populate('author assignee')
    .exec((err, task) => {
        console.log(task);
    });

User.findOne({ login: 'maciej' })
    .populate('tasks')
    .exec(function (err, user) {
        console.log(user);
    });
