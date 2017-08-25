const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../bin/db');
const assert = require('assert');

const taskSchema = new Schema({
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rank: Number,
    importance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Importance'
    },
    seb: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    notifications: Array,
    files: Array,
    externalId: Number,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

taskSchema.statics.countTasks = function (filter) {
    return new Promise((resolve, reject) => {
        let statusString = filter.status;

        let condition = {
            title: new RegExp(filter.search, 'i'),
            content: new RegExp(filter.search, 'i'),
        };

        if (statusString !== 'null') {
            let statusArray = statusString.split(',');
            if (statusArray.length) {
                condition.status = {$in: statusArray}
            }
        }

        this.count(condition).exec((err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        })
    });
};

taskSchema.statics.filterTasks = function (filter) {
    return new Promise((resolve, reject) => {
        let statusString = filter.status;

        let condition = {
            title: new RegExp(filter.search, 'i'),
            content: new RegExp(filter.search, 'i'),
        };

        if (statusString !== 'null') {
            let statusArray = statusString.split(',');
            if (statusArray.length) {
                condition.status = {$in: statusArray}
            }
        }

        let tasks = this.find(condition)
            .skip((filter.page - 1) * filter.perPage)
            .limit(parseInt(filter.perPage))
            .populate('author assignee comments status');

        let orderColumn = filter.orderBy;
        let orderDir = filter.orderDir;

        tasks.sort({[orderColumn]: orderDir});

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

// taskSchema.statics.getTaskStatusArray = function () {
//     return [
//         {id: 0, name: 'Dev-wait'},
//         {id: 1, name: 'Paker'},
//         {id: 2, name: 'Done'},
//         {id: 3, name: 'Feature'},
//         {id: 4, name: 'Dev-active'}
//     ];
// };
//
// taskSchema.statics.getTaskImportanceArray = function () {
//     return [
//         {id: 1, name: 'Normal'},
//         {id: 2, name: 'Urgent'},
//         {id: 3, name: 'Sebastian'}
//     ];
// };

let Task = mongoose.model('Task', taskSchema);

module.exports = Task;
