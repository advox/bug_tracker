const pool = require('./db/connection');
const Task = require('../models/task');
const User = require('../models/user');
const Status = require('../models/task/status');
const Importance = require('../models/task/importance');
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
    removeTaskStatuses: function() {
        return new Promise((resolved, reject) => {
            Status.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    addTaskStatuses: function () {
        let status = new Status({
            externalId: 0, name: 'Dev-wait'
        });
        status.save();
        status = new Status({
            externalId: 1, name: 'Paker'
        });
        status.save();
        status = new Status({
            externalId: 2, name: 'Done'
        });
        status.save();
        status = new Status({
            externalId: 3, name: 'Feature'
        });
        status.save();
        status = new Status({
            externalId: 4, name: 'Dev-active'
        });
        status.save();
    },
    removeTaskImportance: function() {
        return new Promise((resolved, reject) => {
            Importance.remove({}, (err) => {
                if (err) {
                    return reject(err)
                }
                return resolved();
            });
        })
    },
    addTaskImportance: function () {
        let importance = new Importance({
            externalId: 1, name: 'Normal'
        });
        importance.save();
        importance = new Importance({
            externalId: 2, name: 'Urgent'
        });
        importance.save();
        importance = new Importance({
            externalId: 3, name: 'Sebastian'
        });
        importance.save();
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