const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Client = new Schema({
    name: String,
    code: {
        type: String,
        unique: true,
        index: true
    },

    description: {
        type: String
    },

    clientProps: Schema.Types.Mixed,
    createdDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Client', Client);