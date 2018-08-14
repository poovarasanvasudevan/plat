const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    fName: String,
    lName: String,
    email: {
        type: String,
        index: true,
        unique: true
    },
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    createdDate: {type: Date, default: Date.now},
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);