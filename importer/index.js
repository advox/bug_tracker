const pool = require('./db/connection');
const User = require('../models/user');
const Task = require('../models/task');
const db = require("../bin/db");
const Promise = require('bluebird');

User.remove({}, () => {});
Task.remove({}, () => {});

pool.query('SELECT * FROM admins where `login` not like "xxx%" and `name` not like "xxx%"', function (error, results, fields) {
    results.map(row => {
        name = row.name.split(' ');
        let user = new User({
            login: row.login,
            password: row.pass,
            email: row.admin_email,
            name: name[0],
            surname: name[1],
            status: row.active,
            group: row.group === 'manager' ? 1 : row.group === 'dev' ? 2 : 0,
            color: row.color
        });
        user.save();
    })
});

pool.query(`
    SELECT z.*, a.admin_email as author_email, a2.admin_email as assignee_email
    FROM zgloszenia z
    JOIN admins a on z.zgl_admin_id=a.id
    JOIN admins a2 on z.zgl_to_admin_id=a2.id`,
    function (error, results, fields) {
    console.log(results.length);
    results.map(row => {
        Promise.props({
            author: User.getByEmail(row.author_email),
            assignee: User.getByEmail(row.assignee_email),
        }).then(results => {
            if (results.author.length === 1 && results.assignee.length === 1) {
                let task = new Task({
                    status: row.zgl_status,
                    title: row.zgl_title,
                    content: row.zgl_desc,
                    rank: row.zgl_ranga,
                    important: 1,
                    author: results.author[0]._id,
                    assignee: results.assignee[0]._id,
                    notifications: [],
                    files: [],
                });
                task.save();
            }
        });
    });
});

return null;
