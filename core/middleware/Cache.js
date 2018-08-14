const flatCache = require('flat-cache')
const path = require('path')

const redis = require('redis')
const client = redis.createClient();


let cache = flatCache.load('coore-cache', path.join(__dirname, '../../cache'));

let flatCacheMiddleware = (req, res, next) => {

    if(req.path.startsWith('/asset')) {
        let key = '__express__' + req.originalUrl || req.url
        let cacheContent = cache.getKey(key);
        if (cacheContent) {
            res.send(cacheContent);
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                cache.setKey(key, body);
                cache.save();
                res.sendResponse(body)
            }
            next()
        }
    } else {
        next()
    }


};

module.exports = flatCacheMiddleware