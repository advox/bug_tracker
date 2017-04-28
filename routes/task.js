const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const Comment = require('../models/comment');
const Promise = require('bluebird');
const util = require('util');
const mkdirp = require('mkdirp');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        mkdirp('upload/' + req.body._id, function(err) {
            if (err) {
                console.log(err);
            }
            callback(null, 'upload/' + req.body._id);
        });
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage : storage }).array('files', 5);

/**
 * task index action
 */
router.get('/', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            done: Task.findDone(),
            todo: Task.findToDo(),
        }).then(function (results) {
            response.render('task/index', {
                done:     results.done,
                todo:     results.todo,
            })
        });
    }
);

/**
 * task create action
 */
router.get('/new', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            users: User.findAll(),
            priority: Task.getTaskPriorityArray(),
        }).then(function (results) {
            response.render('task/edit', {
                users: results.users,
                priority: results.priority,
            });
        }).catch(function (error) {
            console.log(error);
        })
    }
);

/**
 * task edit action
 */
router.get('/edit/:id', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            task: Task.findById(request.params.id),
            users: User.findAll(),
            comments: Comment.findByTaskId(request.params.id),
            priority: Task.getTaskPriorityArray(),
        }).then(function (results) {
            response.render('task/edit', {
                task: results.task,
                users: results.users,
                comments: results.comments,
                priority: results.priority,
                errors: request.flash('errors')
            });
        }).catch(function (error) {
            console.log(error);
        })
    }
);

/**
 * task save action
 */
router.post('/save', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        upload(request, response, function(err) {
            if(err) {
                console.log(err);
                return;
            } else {
                request.body.files = request.files;
            }

            if (request.body._id) {
                Task.findOneAndUpdate(
                    {_id: request.body._id},
                    request.body,
                    { runValidators: true },
                    function(err){
                        if (err) {
                            request.flash('errors', err.errors);
                        }
                        response.redirect('/task/edit/' + request.body._id);
                    }
                );
            } else {
                delete request.body['_id'];
                var task = new Task(request.body);
                task.status = 1;
                task.notifications = [];
                task.files = request.files;
                task.save();
                response.redirect('/task');
            }
        });
    }
);

/**
 * task delete action
 */
router.post('/delete', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Task.remove({ _id: request.body._id }, function (err) {
            if (err) {
                console.log(err);
            }
            response.redirect('/task');
        });
    }
);

module.exports = router;
