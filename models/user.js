const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: String,
    password: String,
    email: String,
    status: Boolean,
    group: Number,
    color: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    lastLogin: {type: Date},
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
