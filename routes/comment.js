const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const Comment = require('../models/comment');
const db = require('../bin/db');
const Promise = require('bluebird');
const util = require('util');
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


router.post('/', function(request, response) {
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
});


router.post('/save', function(request, response) {
    var comment = new Comment(request.body);
    comment.status = 1;
    comment.notifications = [];
    comment.author = request.session.passport.user._id;

    if (typeof comment.parent == 'undefined') {
        comment.parent = null;
    }

    comment.save(function(err){
        if (err) {
            request.flash('errors', err.errors);
        }
    });
    response.redirect('/task/edit/' + request.body.task);
});

module.exports = router;
