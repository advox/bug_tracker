const pool = require('./db/connection');
const Task = require('../models/task');
const User = require('../models/user');
const db = require("../bin/db");
const Promise = require('bluebird');

module.exports = {
    removeAllTasks: function () {
        return new Promise((resolved, reject) => {
            Task.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    importTasks: function (adminIds) {
        return new Promise((resolved, reject) => {
            pool.query(`
            SELECT * FROM zgloszenia WHERE zgl_admin_id in (${adminIds}) AND zgl_to_admin_id in (${adminIds}) AND zgl_title > '' AND zgl_desc > ''`,
            function (error, results, fields) {
                results.map(row => {
                    Promise.props({
                        author: User.getByExternalId(row.zgl_admin_id),
                        assignee: User.getByExternalId(row.zgl_to_admin_id),
                    }).then(results => {
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
                            externalId: row.zgl_id,
                            createdAt: row.zgl_date,
                            updatedAt: row.zgl_akt,
                        });
                        try {
                            task.save()
                        } catch (err) {
                            return reject(err)
                        }
                        return resolved();
                    });
                });
            });
        })
    },
};