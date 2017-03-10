const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const db = require('../bin/db');
const Promise = require('bluebird');

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        Promise.props({
            done: Task.findDone(),
            todo: Task.findToDo(),
        }).then(function(results) {
            res.render('task/index', {
                done: results.done,
                todo: results.todo,
            })
        });
    });

router.get('/edit/:id',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        Promise.props({
            task: getTask(req),
            users: getUsers()
        }).then((function (results) {
            res.render('task/edit', {
                task: taskData
            });
        }).catch(function(error){
            console.log(error);
        });
    });

router.post('/save', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

getTask = function getTask(req) {
    return new Promise((resolve, reject) => {
        Task.findOne({_id: req.params.id}, (err, task) => {
            if (err) {
                return reject(err);
            }
            return resolve(task);
        });
    });
};


getUsers = function getUsers() {
    return new Promise((resolve, reject) => {
        User.find({}, (err, users) => {
            if (err) {
                return reject(err);
            }
            return resolve(users);

        });
    });
};

module.exports = router;
