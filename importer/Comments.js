const pool = require('./db/connection');
const Comment = require('../models/comment');
const Task = require('../models/task');
const User = require('../models/user');
const db = require("../bin/db");
const Promise = require('bluebird');

module.exports = {
    removeAllComments: function () {
        return new Promise((resolved, reject) => {
            Comment.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    importComments: function () {
        return new Promise((resolved, reject) => {
            pool.query(`select * from zgloszenia_odp where odp_text > '' order by odp_main_odp_id`,
            function (error, results, fields) {
                console.log(results);
                if (error) console.log(error);
                results.map(row => {
                    Promise.props({
                        parentTask: Task.getByExternalId(row.odp_zgl_id),
                        author: User.getByExternalId(row.odp_admin_id),
                        parentComment: Comment.getByExternalId(row.odp_main_odp_id)
                    }).then(results => {
                        if (0 !== results.parentTask.length && 0 !== results.author.length) {
                            let comment = new Comment({
                                author: results.author[0]._id,
                                task: results.parentTask[0]._id,
                                content: row.odp_text,
                                createdAt: row.odp_date,
                                updatedAt: row.odp_date,
                                status: row.odp_done,
                            });
                            try {
                                comment.save()
                            } catch (err) {
                                return reject(err)
                            }
                            return resolved();
                        }
                    });
                });
            });
        })
    }
};