const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/', (req, res) => {
    Task.findAll({}, (err, tasks) => {
        if (err) {
            console.log(err);
        }

        res.render('index', {tasks: tasks});
    })
});

module.exports = router;