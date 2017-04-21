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
    important: Number,
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

taskSchema.statics.findDone = function () {
    return new Promise((resolve, reject) => {
        this.find({status: 2})
            .populate('author assignee comments')
            .exec((err, tasks) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tasks);
            })
    });
};

taskSchema.statics.findToDo = function () {
    return new Promise((resolve, reject) => {
        this.find({status: {$ne: 2}})
            .populate('author assignee comments')
            .exec((err, tasks) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tasks);
            })
    })
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
