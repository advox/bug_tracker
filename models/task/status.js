const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    name: {
        type: String,
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
    externalId: {
        type: Number,
        required: true
    }
});

statusSchema.statics.findAll = function () {
    return new Promise((resolve, reject) => {
        Status.find({}, (err, statuses) => {
            if (err) {
                return reject(err);
            }

            return resolve(statuses);
        });
    });
};

statusSchema.statics.getByExternalId = function (id) {
    return new Promise((resolve, reject) => {
        this.find({externalId: id}, (err, status) => {
            if (err) {
                return reject(err);
            }
            return resolve(status);
        })
    })
};

let Status = mongoose.model('Status', statusSchema);

module.exports = Status;
