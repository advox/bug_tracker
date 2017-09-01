const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    sessionId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

sessionSchema.statics.isTokenValid = function (token) {
    return new Promise((resolve, reject) => {
        this.findOne(
            {
                token: token,
                // expireDate: {$gt: new Date()}
            }
        ).exec((err, result) => {
            if (err) {
                return reject();
            }

            if (result !== null) {
                return resolve();
            } else {
                return reject();
            }
        });
    });
};

let Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
