const express = require('express');
const router = express.Router();
const md5 = require('md5');
const randomstring = require('randomstring');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/', function (request, response) {
    User.findOne({
        login: request.body.login,
        password: md5(request.body.password)
    }, function (err, user) {
        if (err) {
            response.statusCode = 500;
            response.send({
                error: err
            });
            return;
        }

        if (!user) {
            response.statusCode = 400;
            response.send({
                error: 'Incorrect login or password'
            });
            return;
        }

        Session.remove({
            userId: user._id
        }, function (err, result) {
            let currentDate = new Date();
            let expireDate = new Date(currentDate);
            expireDate.setMinutes(currentDate.getMinutes() + 30);

            var session = new Session({
                userId: user._id,
                token: randomstring.generate(256),
                expireDate: new Date(expireDate)
            });

            session.save(function (err, result) {
                if (err) {
                    response.statusCode = 500;
                    response.send({
                        error: err
                    });
                    return;
                }

                response.statusCode = 200;
                response.send({
                    login: user.login,
                    token: result.token,
                    expireDate: result.expireDate
                });
            });
        });
    });
});

router.delete('/', function (request, response) {
    Session.remove({
        token: request.headers['authentication-token']
    }, function (err, result) {
        if (err) {
            response.statusCode = 500;
            response.send({
                error: err
            });
            return;
        }

        if (!result) {
            response.statusCode = 400;
            response.send({
                error: 'Incorrect token'
            });
            return;
        }

        response.statusCode = 200;
        response.send();
        return;
    });
});

module.exports = router;
