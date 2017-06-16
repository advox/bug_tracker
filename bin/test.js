const db = require("./db");
const User = require('../models/user');
const Comment = require('../models/comment');
const Status = require('../models/status');
const Task = require('../models/task');

var status = new Status();



status.save();

{ id: 0, name: 'Dev-wait' },
{ id: 1, name: 'Paker' },
{ id: 2, name: 'Done' },
{ id: 3, name: 'Feature' },
{ id: 4, name: 'Dev-active' }

return null;


const comment = new Comment({
    author: '58cbc6515eab8b506e33c5f3',
    content: "Witam serdecznie oto komentarz 76676",
    status: 1,
    task: '58de11f382530646e3aa35e5',
    parent: '58f0997558e659583c61de7b',
    priority: 2,
});
comment.save();
return null;

// User.remove({_id: "58cbc65a0c236d5081b1e208"}, function(err, result) {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
//     db.close();
// });
// return null;
// Task.remove({}, function () {console.log('removed tasks')});
// User.remove({}, function () {console.log('removed users')});
// return null;

const user = new User({
    login: 'michal',
    password: 'pass',
    email: 'michalpnowicki',
    name: 'Michal',
    surname: 'Nowicki',
    status: 1,
    group: 1,
    color: '#cccccc'
});

 user.save();


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
