const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: String,
    password: String,
    email: String,
    name: String,
    surname: String,
    status: Boolean,
    group: Number,
    color: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

userSchema.statics.findAll = function () {
    return new Promise((resolve, reject) => {
        User.find({}, (err, users) => {
            if (err) {
                return reject(err);
            }
            return resolve(users);

        });
    });
};

userSchema.statics.getByEmail = function (email) {
    return new Promise((resolve, reject) => {
        User.find({email: email}, (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user);
        })
    })
};

let User = mongoose.model('User', userSchema);

module.exports = User;
