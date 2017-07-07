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

let Status = mongoose.model('Status', statusSchema);

module.exports = Status;
