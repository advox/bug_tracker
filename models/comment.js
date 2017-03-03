const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: Number,
    parentId: Number,
    content: String,
    status: Number,
    taskId: Number,
    files: String,
    notifications: Array,
    priority: Number,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
