const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../bin/db');
const assert = require('assert');

const taskSchema = new Schema({
    status: Number,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rank: Number,
    important: Array,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notifications: Array,
    files: Array,
    externalId: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

taskSchema.statics.countTasks = function (filter) {
    return new Promise((resolve, reject) => {
        let statusString = filter.status;
        let statusArray = statusString.split(',');
        this.find(
            {
                status: { $in: statusArray }
            }
        ).exec((err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

taskSchema.statics.filterTasks = function (filter) {
    return new Promise((resolve, reject) => {
        let statusString = filter.status;
        let statusArray = statusString.split(',');
        let tasks = this.find(
            {
                status: { $in: statusArray },
                title: new RegExp(filter["search[value]"], 'i'),
                content: new RegExp(filter["search[value]"], 'i'),
            }
        )
        .populate('author assignee comments');

        if (typeof filter.start != "undefined") {
            tasks.skip(parseInt(filter.start));
        }

        if (typeof filter.length != "undefined") {
            tasks.limit(parseInt(filter.length));
        }

        let orderColumnId = filter['order[0][column]'];
        let orderColumnName = filter['columns['+orderColumnId+'][name]'];
        let orderColumnDir = filter['order[0][dir]'];
        let dir = '';
        if (orderColumnDir == 'desc') {
            dir = '-';
        }
        tasks.sort(dir + orderColumnName);

        tasks.exec((err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

taskSchema.statics.findById = function (taskId) {
    return new Promise((resolve, reject) => {
        Task.findOne({_id: taskId}, (err, task) => {
            if (err) {
                return reject(err);
            }
            return resolve(task);
        });
    });
};

taskSchema.statics.findByTitle = function (title) {
    return new Promise((resolve, reject) => {
        Task.find({title: title}, (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user);
        })
    })
};

taskSchema.statics.getByExternalId = function (id) {
    return new Promise((resolve, reject) => {
        this.find({externalId: id}, (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user);
        })
    })
};

taskSchema.statics.getTaskPriorityArray = function () {
    return [
        {id: 0, name: 'Normal'},
        {id: 1, name: 'Urgent'}
    ];
};


let Task = mongoose.model('Task', taskSchema);

module.exports = Task;
