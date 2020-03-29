const express = require("express"); 
var path = require("path");

const router = express.Router();


router.get("/register", (req,res,next) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
})
router.get("/login", (req,res,next) =>{
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

module.exports = router; 