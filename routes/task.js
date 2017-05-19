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
        mkdirp('public/images/upload/' + req.body._id, function (err) {
            if (err) {
                console.log(err);
            }
            callback(null, 'public/images/upload/' + req.body._id);
        });
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage}).array('files', 5);

router.get(
    '/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        response.render('task/index')
    }
);

router.get(
    '/new',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            users: User.findAll(),
            priority: Task.getTaskPriorityArray(),
        }).then(function (results) {
            response.render('task/edit', {
                users: results.users,
                priority: results.priority,
                task: new Task(),
            });
        })
    }
);

router.post(
    '/grid',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            taskList: Task.filterTasks(request.body),
            countTask: Task.countTasks({status: request.body.status}),
        }).then(function (results) {
            response.status(200).json(
                {
                    "draw": request.body.draw,
                    "recordsTotal": results.countTask.length,
                    "recordsFiltered": results.countTask.length,
                    "data": results.taskList
                }
            );
        }).catch(function (error) {
            console.log(error);
        });
    }
);

router.get(
    '/edit/:id',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
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
        })
    }
);

router.post(
    '/save',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        if (request.body._id) {
            request.flash('errors', 'Cannot update an existing task.');
            response.redirect('/task/edit/' + request.body._id);
        }
        upload(request, response, function (err) {
            if (err) {
                if (err) {
                    request.flash('errors', err.errors);
                }
                response.redirect('/task/edit/' + request.body._id);
            }
            let files = request.files;
            delete request.body.files;
            Task.findOneAndUpdate(
                {_id: request.body._id},
                {
                    '$set': request.body,
                    '$push': {
                        files: {
                            '$each': files
                        }
                    }
                },
                {
                    runValidators: true,
                    new: true,
                    upsert: true
                },
                function (err) {
                    if (err) {
                        request.flash('errors', err.errors);
                    }
                    response.redirect('/task/edit/' + request.body._id);
                }
            );
        });
    }
);

router.post(
    '/delete',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Task.remove({_id: request.body._id}, function (err) {
            if (err) {
                console.log(err);
            }
            response.redirect('/task');
        });
    }
);

module.exports = router;
