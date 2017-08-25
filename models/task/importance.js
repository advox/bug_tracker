const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const importanceSchema = new Schema({
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

importanceSchema.statics.getByExternalId = function (id) {
    return new Promise((resolve, reject) => {
        this.find({externalId: id}, (err, importance) => {
            if (err) {
                return reject(err);
            }
            return resolve(importance);
        })
    })
};

let Importance = mongoose.model('Importance', importanceSchema);

module.exports = Importance;
