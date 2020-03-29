const express = require("express");
var path = require("path");

var app = express();

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })




const userController = require('../controllers/userController');
const router = express.Router();


router.get("/profile", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'));
})


router.get("/register", userController.getUserRegister)
router.get("/login", userController.getUserLogin);

router.post("/register", urlencodedParser, userController.postUserRegister);
router.post("/login", userController.postUserLogin);


module.exports = router;