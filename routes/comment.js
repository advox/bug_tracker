const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
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
router.post('/save', require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        var comment = new Comment(request.body);
        comment.status = 1;
        comment.notifications = [];
        comment.author = request.session.passport.user._id;

        if (typeof comment.parent == 'undefined') {
            comment.parent = null;
        }
        comment.save(function(err) {
            let errors;
            if(err) {
                errors = err.errors;
            }
            response.status(200).json({'errors': errors});
        });
    }
);

module.exports = router;
