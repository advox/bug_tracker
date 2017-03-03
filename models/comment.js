const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    content: String,
    status: Number,
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    files: String,
    notifications: Array,
    priority: Number,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
