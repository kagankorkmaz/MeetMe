var path = require("path");
const User = require("../models/User");
const passport = require('passport');
const { update } = require("../models/User");
require('../authentication/passport/local');



module.exports.getUserLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};

module.exports.getUserRegister = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
};



module.exports.postUserLogin = (req, res, next) => {
    console.log("user controller works");
    console.log("body parsing", req.body);
    passport.authenticate("local", {
        successRedirect: "/profile",                        //DEĞİŞECEK ///////////////////////////////
        failureRedirect: "/login",
        failureFlash: true,                     // DİKKAT
        successFlash: true                    // DİKKAT
    })(req, res, next);
};



module.exports.postUserRegister = (req, res, next) => {
    console.log(req.body)
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.pass;
    const errors = [];
    //res.send("Register attempted");

    ///////////////////////////7SERVER SIDE VALIDATION ///////////////////////
    User.findOne({
        username
    }).then(user => {
        if (user) {
            console.log('Username already exists.')
            errors.push({ message: "Username already taken." })        // HATA MESAJI EKLENECEK!!!!!!!!!!!!!!!!!!!!!!!!!1
            return res.sendFile(path.join(__dirname, '../public', 'signup.html'));
            username,
                email,
                pass,
                errors
        }
    }).catch(err => console.log(err));

    User.findOne({
        email
    }).then(user => {
        if (user) {
            console.log('email already exists.')
            errors.push({ message: "email already taken." })        // HATA MESAJI EKLENECEK!!!!!!!!!!!!!!!!!!!!!!!!!1
            return res.sendFile(path.join(__dirname, '../public', 'signup.html'));
            username,
                email,
                pass,
                errors
        }
    }).catch(err => console.log(err));

    const newUser = new User({
        username: username,
        email: email,
        pass: pass,
        googleıd: '',
        accessToken: '',
        refreshToken: '',
        about: '',
        phone: '',
        jobDescription: '',
        profession: '',
        totalMeetings: 0,
        bio: '',
        twitter: '',
        instagram: '',
        website: '',
        linkedin: '',
        calender: [],
        poll: {},
        meeting: []
    })

    newUser.save().then(() => {
        console.log("DB save user Succesful");
        req.flash("flashSuccess", "Succesfully Registered");

        res.redirect("/login",)
    }).catch(err => console.log(err));
};

module.exports.postUserEdit = (req, res, next) => {

    async function main() {
        let updatedValues = {
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            jobDescription: req.body.jobDescription,
            profession: req.body.profession,
            bio: req.body.bio
        };

        //console.log(updatedValues);

        for (let prop in updatedValues) if (!updatedValues[prop]) delete updatedValues[prop];//it will remove fields who are undefined or null 

        await User.updateOne({ _id: req.user.id }, updatedValues)
            .then(User => {
                if (!User) { return res.status(404).end(); }
            })
            .catch(err => next(err));

        res.redirect("/profile")
    }

    main();

};


module.exports.postCalender = (req, res, next) => {

    async function updateCalender() {
        let updatedValues = {
            calender: req.body.calender
        };

        await User.updateOne({ email: req.user.email }, updatedValues)
            .then(User => {
                if (!User) { return res.status(404).end(); }
            })
            .catch(err => next(err));

        res.redirect("/profile/calender");
    }

    updateCalender();



};

module.exports.postCalenderMeet = (req, res, next) => {
    console.log("POST CALENDAR MEEEET")

    async function main() {

        var userCalendars = [];

        for (email of req.body.mails) {
            await User.findOne({
                email: email
            }).then(user => {
                if (user) {
                    //console.log(user.name);
                    //console.log(user.calender);
                    userCalendars.push(user.calender)
                }
            }).catch(err => console.log(err));
        }

        userCalendars.push(req.user.calender);

        console.log("1");
        console.log(userCalendars);
        console.log("2");

        return userCalendars;

    }

    main();


    res.redirect("/profile/calender");
};

