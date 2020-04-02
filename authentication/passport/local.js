const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
//const bcrypct = require('bcryptjs');
const User = require("../../models/User");
const { func } = require("prop-types");
const mongoose = require('mongoose');

passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField:'pass' }, (email, pass, done) => {
        //Öyle bir email varsa bize user içinde gelecek.
        console.log(email,pass);
        User.findOne({ email }, (err, user) => {
            console.log("içerdeyiz");
            if (err) return done(err, null, "There is an error(local.js)");

            if (!user) {
                console.log("No user found");
                return done(null, false, "User not found");
            }

            if (pass == user.pass) {
                // req.user
                console.log("succesfully logged in");
                return done(null, user, "Succesfully logged in:)")

            }

            else if (pass != user.pass) {
                console.log("Incorrect password");
                return done(null, false, "Incorrect Password");
            }
        })
    })); 


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});