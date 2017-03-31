const express = require('express');
const router = express.Router();
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

        request.checkBody('content', 'Description cant be empty').notEmpty();

        request.getValidationResult().then(function(result) {
            if (!result.isEmpty()) {
                response.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
                return;
            }
            response.json({
                urlparam: req.params.urlparam,
                getparam: req.params.getparam,
                postparam: req.params.postparam
            });
        });

        if (request.body._id) {
            Task.findOneAndUpdate({_id: request.body._id}, request.body, {}, function(err){
                if (err) {
                    console.log(err);
                }
                response.redirect('/task');
            });
        } else {
            delete request.body['_id'];
            var task = new Task(request.body);
            task.status = 1;
            task.notifications = [];
            task.files = [];
            task.save();
            response.redirect('/task');
        }
    })
});

router.post('/delete', function(request, response) {
    Task.remove({ _id: request.body._id }, function (err) {
        if (err) return handleError(err);
        response.redirect('/task');
    });
});

module.exports = router;
