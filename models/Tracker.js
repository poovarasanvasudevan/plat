const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Tracker = new Schema({
    ip: String,
    sessionID: String,
    page: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    reqParams: Schema.Types.Mixed,
    createdDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Tracker', Tracker);