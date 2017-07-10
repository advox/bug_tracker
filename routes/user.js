const express = require('express');
const router = express.Router();
//const Task = require('../models/task');
const User = require('../models/user');
//const Comment = require('../models/comment');
const Promise = require('bluebird');
const md5 = require('md5');
//const util = require('util');

router.get(
    '/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        response.render('user/index', {
//            importanceArray: Task.getTaskPriorityArray(),
        });
    }
);

router.get(
    '/new',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
//            users: User.findAll(),
//            priority: Task.getTaskPriorityArray(),
        }).then(function (results) {
            response.render('user/edit', {
//                users: results.users,
//                priority: results.priority,
                user: new User(),
            });
        });
    }
);

router.post(
    '/grid',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
            userList: User.filterUsers(request.body),
            countUser: User.countUsers(request.body),
        }).then(function (results) {
            response.status(200).json(
                {
                    "draw": request.body.draw,
                    "recordsTotal": results.countUser.length,
                    "recordsFiltered": results.countUser.length,
                    "data": results.userList
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
            user: User.findById(request.params.id),
        }).then(function (results) {
            response.render('user/edit', {
                user: results.user,
                message: {errors: request.flash('errors'), success: request.flash('success')}
            });
        });
    }
);

router.post(
    '/save',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        if (request.body.newPassword.length) {
            if (request.body.newPassword === request.body.newPasswordRepeat) {
                request.body.password = md5(request.body.newPassword);
            } else {
                request.flash('errors', { 'error' : {message : 'Passwords are not the same'}});
                response.redirect('/user/edit/' + request.body._id);
                return;
            }
        }
        
        User.findOneAndUpdate(
            {_id: request.body._id},
            {
                '$set': request.body
            },
            {
                runValidators: true,
                new : true,
                upsert: true
            },
            function (err, user) {
                if (err) {
                    request.flash('errors', err.errors);
                } else {
                    request.flash('success', 'Saved!');
                }
                response.redirect('/user/edit/' + user.id);
            }
    );
    }
);
//
//router.post(
//    '/delete',
//    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
//    (request, response) => {
//        Task.remove({_id: request.body._id}, function (err) {
//            if (err) {
//                console.log(err);
//            }
//            response.redirect('/task');
//        });
//    }
//);

module.exports = router;
