const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Promise = require('bluebird');
const md5 = require('md5');

router.get(
    '/',
    (request, response) => {
        response.render('user/index', {
        });
    }
);

router.get(
    '/new',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        Promise.props({
        }).then(function (results) {
            response.render('user/new', {
                user: new User()
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
                user: results.user
            });
        });
    }
);

router.post(
    '/update',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        if (request.body.newPassword.length) {
            if (request.body.newPassword === request.body.newPasswordRepeat) {
                request.body.password = md5(request.body.newPassword);
            } else {
                request.flash('errors', { message : 'Passwords are not the same'});
                response.redirect('/user/edit/' + request.body._id);
                return;
            }
        }
        
        if(typeof request.body.userManagement === 'undefined') {
            request.body.userManagement = false;
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
            function (err) {
                if (err) {
                    request.flash('errors', err);
                } else {
                    request.flash('success', 'Saved!');
                }
                
                response.redirect('/user/edit/' + request.body._id);
            }
    );
    }
);

router.post(
    '/add',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (request, response) => {
        if (request.body.newPassword.length) {
            if (request.body.newPassword === request.body.newPasswordRepeat) {
                request.body.password = md5(request.body.newPassword);
            } else {
                request.flash('errors', { message : 'Passwords are not the same'});
                response.redirect('/user/new');
                return;
            }
        } else {
            request.flash('errors', { message : 'Empty password'});
            response.redirect('/user/new');
            return;
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
            function (err) {
                if (err) {
                    request.flash('errors', err);
                } else {
                    request.flash('success', 'Saved!');
                }
                
                response.redirect('/user/new');
                return;
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
