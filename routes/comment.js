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

/**
 * comment get ajax action
 */
router.post('/', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            comments: Comment.findByTaskId(request.body.taskId, request.body.commentId),
        }).then(function (results) {
            response.render('partials/comment/entries', {
                layout: false,
                comments: results.comments,
            });
        }).catch(function (error) {
            console.log(error);
        });
    }
);

/**
 * comment create ajax action
 */
router.post('/save',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        upload(request, response, function (err) {
            if (err) {
                if (err) {
                    request.flash('errors', err.errors);
                }
                console.log('error');
                response.redirect('/task/edit/' + request.body._id);
            }

            let files = [];
            if (typeof request.files !== 'undefined') {
                files = request.files;
            }

            let notifications = [];
            if (typeof request.files !== 'undefined') {
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
                author: request.session.passport.user._id
            };

            let comment = new Comment(data);

            comment
                .save()
                .then(function(result){

                    let taskUpdate = {
                        important: request.body.important,
                        rank: request.body.rank,
                        assignee: request.body.assignee
                    };
                    // console.log(123);
                    //
                    //
                    // Task.update({ _id: request.body.task }, { $set: {
                    //
                    //     }});

                    Task.findOne({ _id: request.body.task }, function (err, task){
                        task.important = request.body.important;
                        task.rank = request.body.rank;
                        task.assignee = request.body.assignee;
                        task.save();
                    });

                    // Task.findByIdAndUpdate(request.body.task, { $set: taskUpdate}, { new: false, function (err, task) {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    // }});
                })
                .then(function(){
                    response.status(200).json({});
                });

            //
// console.log('noerror');
//             Promise.props({
//                 comment: function () {
//                     let comment = new Comment({
//                         content: request.body.content,
//                         files: request.files,
//                         notifications: request.notifications,
//                         task: request.body.task,
//                         parent: request.body.parent,
//                         author: request.session.passport.user._id
//                     });
//                     console.log('11111111');
//                     comment.save();
//                     console.log('22222222');
//                 }
//                 // task: function () {
//                 //     Task.findOneAndUpdate(
//                 //         {_id: request.body.task},
//                 //         {
//                 //             important: request.body.important,
//                 //             rank: request.body.rank,
//                 //             assignee: request.body.assignee,
//                 //         }
//                 //     );
//                 // }
//             }).then(function () {
//                 response.status(200).json({});
//             });
        });
    }
);

module.exports = router;
