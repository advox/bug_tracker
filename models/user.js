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
    externalId: Number,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    lastLogin: {type: Date},
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

userSchema.statics.countUsers = function (filter) {
    return new Promise((resolve, reject) => {
        this.find(
                {
                    $or: [
                        {name: new RegExp(filter.search.value, 'i')},
                        {surname: new RegExp(filter.search.value, 'i')},
                        {login: new RegExp(filter.search.value, 'i')},
                        {email: new RegExp(filter.search.value, 'i')}
                    ]
                }
        ).exec((err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

userSchema.statics.filterUsers = function (filter) {
    return new Promise((resolve, reject) => {
        let users = this.find(
                {
                    $or: [
                        {name: new RegExp(filter.search.value, 'i')},
                        {surname: new RegExp(filter.search.value, 'i')},
                        {login: new RegExp(filter.search.value, 'i')},
                        {email: new RegExp(filter.search.value, 'i')}
                    ]
                }
        );

        if (typeof filter.start !== "undefined") {
            users.skip(parseInt(filter.start));
        }

        if (typeof filter.length !== "undefined") {
            users.limit(parseInt(filter.length));
        }

        let orderColumnId = filter.order[0].column;
        let orderColumnName = filter.columns[orderColumnId].name;
        let orderColumnDir = filter.order[0].dir;

        users.sort({[orderColumnName]: orderColumnDir});

        users.exec((err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

userSchema.statics.findById = function (userId) {
    return new Promise((resolve, reject) => {
        User.findOne({_id: userId}, (err, user) => {
            if (err) {
                return reject(err);
            }
    console.log('witam');
            return resolve(user);
        });
    });
};

let User = mongoose.model('User', userSchema);

module.exports = User;
