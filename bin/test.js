const db = require("./db");
const User = require('../models/user');
const Comment = require('../models/comment');
const Task = require('../models/task');

// var mc = new User({
//     login: 'maciej',
//     password: 'xxx',
//     email: 'mmbozek',
//     status: 1,
//     group: 1,
//     color: 'cccccc'
// });
//
// mc.save();
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

// mc.save();

// User.findOne({login:'maciej'}, (err, user) => {
//     // console.log(user._id);
//     var tc = new Task({
//         status: 1,
//         title: 'test',
//         description: 'cvc',
//         rank: 1,
//         important: 1,
//         authorId: user._id,
//         assigneeId: user._id,
//         notifications: [],
//         files: [],
//     });
//     // tc.save();
// })

Task.findOne({title:'test'})
    // .populate('authorId')
    .exec((err, task) => {
        console.log(task);
    });

return;

