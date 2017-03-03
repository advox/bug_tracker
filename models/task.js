const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    status: Number,
    title: String,
    description: String,
    rank: Number,
    important: Number,
    author: Number,
    assignee: Number,
    notifications: Array,
    files: Array,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;