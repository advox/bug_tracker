const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const db = require('../bin/db');
const Promise = require('bluebird');

router.get('/',
    require('connect-ensure-login').ensureLoggedIn({redirectTo: '/'}),
    (req, res) => {
        Promise.props({
            done: Task.findDone(),
            todo: Task.findToDo(),
        }).then(function(results) {
            res.render('task/index', {
                done: results.done,
                todo: results.todo,
            })
        });
    });

module.exports = router;