const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const Comment = require('../models/comment');
const db = require('../bin/db');
const Promise = require('bluebird');

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        Promise.props({
            done: Task.findDone(),
            todo: Task.findToDo(),
        }).then(function (results) {
            res.render('task/index', {
                done: results.done,
                todo: results.todo,
            })
        });
    });

router.get('/edit',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        Promise.props({
            users: User.findAll(),
            priority: Task.getTaskPriorityArray(),
        }).then(function (results) {
            res.render('task/edit', {
                users: results.users,
                priority: results.priority,
            });
        }).catch(function (error) {
            console.log(error);
        })
    });

router.get('/edit/:id',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        Promise.props({
            task: Task.findById(req.params.id),
            users: User.findAll(),
            priority: Task.getTaskPriorityArray(),
        }).then(function (results) {
            res.render('task/edit', {
                task: results.task,
                users: results.users,
                priority: results.priority,
            });
        }).catch(function (error) {
            console.log(error);
        })
    });

router.post('/save', (req, res) => {

    // upload(req, res, (err) => {
    //     if (err) {
    //         return res.end("Error uploading file.");
    //     }
    //     res.end("File is uploaded");
    // });
});

module.exports = router;
