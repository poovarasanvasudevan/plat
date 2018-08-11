const uuidv4 = require('uuid/v4');

module.exports = function (option) {
    return function (req, res, next) {
        const session = req.session
        if (!session.tracker) {
            session.tracker = uuidv4();
        }
        return next();
    }
}