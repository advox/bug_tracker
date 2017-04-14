const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    content: String,
    status: Number,
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    files: String,
    notifications: Array,
    priority: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

commentSchema.statics.findByTaskId = function (taskId, parent) {
    return new Promise((resolve, reject) => {
        this.find({task: taskId, parent: parent})
            .sort({'createdAt': 'desc'})
            .exec((err, comments) => {
                if (err) {
                    return reject(err);
                }

                return resolve(comments);
            })
    });
};

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
