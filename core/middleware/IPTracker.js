const uuidv4 = require('uuid/v4');
const Tracker = require('../../models/Tracker')

module.exports = function (option) {
    return function (req, res, next) {
        const session = req.session
        if (!session.tracker) {
            session.tracker = uuidv4();
        }

        if(!req.path.startsWith('/asset')) {

            let ud = {
                ip: req.ip,
                reqParams: req.params,
                page: req.originalUrl,
                sessionID: session.tracker
            };

            if(req.user) {
                ud.user = req.user._id
            }
            let tracker = new Tracker(ud)

            tracker.save()
        }
        return next();
    }
}