const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    return res.json({helloo : "ddsf"})
})


module.exports = router;