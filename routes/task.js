const express = require('express');
const router = express.Router();
const extend = require('util')._extend;
const Task = require('../models/task');
const User = require('../models/user');
const Comment = require('../models/comment');
const db = require('../bin/db');
const Promise = require('bluebird');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'upload');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage : storage }).array('files', 5);

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

router.get('/new',
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
        console.log(req.params.id);
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

router.post('/save', function(request, response) {
    upload(request, response, function(err) {
        if(err) {
            console.log(err);
            return;
        }
        Task.findOne({_id: request.body._id}, function(err, data) {
            if (!data)
                return next(new Error('Could not load Document'));
            else {

                data.title = 'dupa44';

                data.save(function(err) {
                    if (err) {
                        console.log('error')
                    }
                    response.redirect('/task');
                });
            }
        });
    })
});

module.exports = router;
