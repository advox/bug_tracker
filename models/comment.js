const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'todo'
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    files: Array,
    notifications: Array,
    externalId: Number,
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
            .populate('author')
            .sort({'createdAt': 'desc'})
            .exec((err, comments) => {
                if (err) {
                    return reject(err);
                }

                return resolve(comments);
            })
    });
};

commentSchema.statics.getByExternalId = function (id) {
    return new Promise((resolve, reject) => {
        this.find({externalId: id}, (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user);
        })
    })
};

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
