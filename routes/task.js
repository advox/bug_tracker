const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const db = require('../bin/db');

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
    console.log(req.user);
    Task.find({}, (err, tasks) => {
        if (err) {
            console.log(err);
        }

        res.render('task/index', {tasks: tasks});
    })
});

module.exports = router;