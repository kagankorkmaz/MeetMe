var path = require("path");
const User = require("../models/User");

module.exports.getUserLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};

module.exports.getUserRegister = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
};

module.exports.postUserLogin = (req, res, next) => {
    res.send("Login attempted");
};

module.exports.postUserRegister = (req, res, next) => {
    console.log(req.body)
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.pass;
    //res.send("Register attempted");

    const newUser = new User({
         username : username,
         email : email,
         pass:pass
    })

    newUser.save().then(() => {
        console.log("DB save user Succesful");
        res.redirect("/");
    }).catch(err=>console.log(err));
};