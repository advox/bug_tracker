const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    content: {
        type: String,
        required: true
    },
    status: String,
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
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
