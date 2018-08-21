const express = require('express');
const router = express.Router();
const passport = require('passport');
const Account = require('../models/Account');
const LoginRedirect = require('../core/middleware/LoginUnAccess')
const IsLoggedIn = require('../core/middleware/IsLoggedIn')
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/register', LoginRedirect, function (req, res) {
    res.render('register', {});
});

router.get('/dashboard', IsLoggedIn, function (req, res) {
    res.render('pages/dashboard', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({
        username: req.body.username,
        fName: req.body.fname,
        lName: req.body.lname,
        email: req.body.email,
        password: new Buffer(req.body.password).toString('base64')
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {account: account});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', LoginRedirect, function (req, res) {
    res.render('login', {user: req.user});
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
}), function(req, res) {
    // Explicitly save the session before redirecting!
    req.session.save(() => {
        res.redirect('/dashboard');
    })
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

module.exports = router;
