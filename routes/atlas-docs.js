const express = require('express');
const router = express.Router();
const isLoggedIn = require('../core/middleware/IsLoggedIn')

router.get('/', function (req, res) {
    return res.render('docs')
})


module.exports = router;