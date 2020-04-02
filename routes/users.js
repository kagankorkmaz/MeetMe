const express = require("express");
var path = require("path");
var app = express();

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');


const userController = require('../controllers/userController');
const router = express.Router();





router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});




router.get("/register", userController.getUserRegister)
router.get("/login", userController.getUserLogin);

router.post("/register", urlencodedParser, userController.postUserRegister);


//router.post("/login", urlencodedParser ,userController.postUserLogin);

router.post('/login', urlencodedParser, passport.authenticate('local'), (req, res) => {
    res.redirect('/profile');
})


module.exports = router;