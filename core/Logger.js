const mongoose = require('mongoose');
const morgan = require('morgan');
const stream = require('stream')
const carrier = require('carrier')

const PassThroughStream = stream.PassThrough

// Schema
const logSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    log: String
});

/**
 * MongooseMorgan object
 * @param  {object} mongoData - represents mongo database data, requires { connectionString : '{MONGO_URL}' } parameter.
 * @param  {object} options - represents morgan options, check their github, default value is empty object {}.
 * @param  {string} format - represents morgan formatting, check their github, default value is 'combined'.
 */
function MongooseMorgan(mongoData, options, format) {
    // Filter the arguments
    const args = Array.prototype.slice.call(arguments);

    if (args.length == 0 || !mongoData.connectionString) {
        throw new Error('Mongo connection string is null or empty. Try by adding this: { connectionString : \'{mongo_url}\'}');
    }

    if (args.length > 1 && typeof options !== 'object') {
        throw new Error('Options parameter needs to be an object. You can specify empty object like {}.');
    }

    if (args.length > 2 && typeof format === 'object') {
        throw new Error('Format parameter should be a string. Default parameter is \'combined\'.');
    }

    options = options || {};
    format = format || 'combined';

    // Create connection to MongoDb
    const collection = mongoData.collection || 'logs';
    const user = mongoData.user || null;
    const pass = mongoData.pass || null;
    mongoose.connect(mongoData.connectionString, {
        useNewUrlParser: true
    });

    // Create stream for morgan to write
    const stream = new PassThroughStream();
    // Create stream to read from
    const lineStream = carrier.carry(stream);
    lineStream.on('line', onLine);

    // Morgan options stream
    options.stream = stream;

    // Create mongoose model
    const Log = mongoose.model('Log', logSchema, collection);

    function onLine(line) {
        const logModel = new Log();
        logModel.log = line;

        logModel.save(function (err) {
            if (err) {
                throw err;
            }
        });
    }

    return morgan(format, options);
}

module.exports = MongooseMorgan;