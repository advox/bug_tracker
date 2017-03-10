const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const db = require('../bin/db');

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {

    Task.find({}, (err, tasks) => {
        if (err) {
            console.log(err);
        }
        res.render('task/index', {tasks: tasks});
    })
});

router.get('/edit/:id',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        var taskData = [];

        var taskPromise = getTask(req);
        var usersPromise = getUsers();

        Promise
            .all([taskPromise, usersPromise])
            .then(function(results){
                console.log(results);
            })
            .catch(function(error){
                console.log(error);
            });


        console.log(taskData);
        //
        // var allPromise = Q.all([ getTask(req), getUsers() ]);
        // allPromise.then(console.log, console.error);
        // allPromise.then(function (data){
        //     console.log(data);
        // }, console.log('error'));

        // getTask(req)
        //     .then(function(task) {
        //         console.log('TAKS');
        //         console.log(task);
        //         taskData.push({task: task});
        //         return getUsers();
        //     })
        //     .then(function(users){
        //         console.log('USERS');
        //         console.log(users);
        //         taskData.push({users: users});
        //     });
        // console.log('ALL');
        // console.log(taskData);
        res.render('task/edit', {
            task: taskData
        });
    });

router.post('/save', (req, res) => {
    upload(req, res, (err) => {
        console.log(req.body);
        console.log(req.files);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

getTask = function getTask(req) {
    return new Promise((resolve, reject) => {
        Task.findOne({_id: req.params.id}, (err, task) => {
            if (err) {
                return reject(err);
            }
            return resolve(task);
        });
    });
};


getUsers = function getUsers() {
    return new Promise((resolve, reject) => {
        User.find({}, (err, users) => {
            if (err) {
                return reject(err);
            }
            return resolve(users);

        });
    });
};

module.exports = router;
