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
    }
});

let Importance = mongoose.model('Importance', importanceSchema);

module.exports = Importance;
