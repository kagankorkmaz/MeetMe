const LocalStrategy = require('passport-local').Strategy;
module.exports = function (passport) {
    debugger
    console.log("asdad")
    passport.use(
        new LocalStrategy({ usernameField: 'email', passwordField: 'pass' }, (email, pass, done) => {
            //Match USer
            console.log("YEAA")
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "That email is not registered" });
                        console.log("Email is not registered.");
                    }

                    //Match pass
                    if (pass == user.pass) {
                        return done(null, user);
                        console.log("Successful login");
                    }

                    else {
                        return done(null, false, { message: "Password incorrect" });
                        console.log("password incorrect");
                    }
                })
                .catch((err => console.log(err)));
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}