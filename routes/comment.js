const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Task = require('../models/task');
const Promise = require('bluebird');
const util = require('util');
const mkdirp = require('mkdirp');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(req.body.task_id);
        mkdirp('public/images/upload/' + req.body.task_id, function (err) {
            if (err) {
                console.log(err);
            }
            callback(null, 'public/images/upload/' + req.body.task_id);
        });
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage}).array('files', 5);

router.get(
    '/:id',
    (request, response) => {
        Promise.props({
            comment: Comment.findById(request.params.id).populate('author'),
            replies: Comment.find({parent: request.params.id}),
        }).then(function (results) {
            response.statusCode = 200;
            response.send(results);
        });
    }
);

router.post('/',
    (request, response) => {
        console.log(request.body);
        upload(request, response, function (err) {
            if (err) {
                if (err) {
                    request.flash('errors', err.errors);
                }
                console.log(err);
                response.redirect('/task/edit/' + request.body._id);
            }

            let files = [];
            if (typeof request.files !== 'undefined') {
                files = request.files;
            }

            let notifications = [];
            if (typeof request.notifications !== 'undefined') {
                notifications = request.notifications;
            }

            let parent = null;
            if (request.body.parent !== '') {
                parent = request.body.parent;
            }

            let data = {
                content: request.body.content,
                files: files,
                notifications: notifications,
                task: request.body.task,
                parent: parent,
                author: request.user._id
            };

            let comment = new Comment(data);

            comment
                .save()
                .then(function (result) {
                    Task.findOne({_id: request.body.task}, function (err, task) {
                        task.important = request.body.important;
                        task.rank = request.body.rank;
                        task.assignee = request.body.assignee;
                        task.save();
                    });
                })
                .then(function () {
                    response.status(200).json({});
                });
        });
    }
);

module.exports = router;
