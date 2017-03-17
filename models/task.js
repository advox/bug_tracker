const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../bin/db');

const taskSchema = new Schema({
    status: Number,
    title: String,
    content: String,
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});


taskSchema.statics.findDone = function () {
    return new Promise((resolve, reject) => {
        this.find({status: 4}, (err, tasks) => {
            if (err) {
                return reject(err);
            }
            return resolve(tasks);
        });
    });
};

taskSchema.statics.findToDo = function () {
    return new Promise((resolve, reject) => {
        this.find({status: {$ne: 4}})
            .populate('author assignee comments')
            .exec((err, tasks) => {
                if (err) {
                    return reject(err);
                }
                return resolve(tasks);
            })
    })
};

let Task = mongoose.model('Task', taskSchema);

module.exports = Task;
