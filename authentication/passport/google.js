const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../models/User');



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //options for the strategy
        callbackURL: '/google/redirect',
        clientID: '805012118741-vvgvhls19vs9d10boh9k156qe6k08h3e.apps.googleusercontent.com',
        clientSecret: 'IvdjL5wmHFDPNFa4YXElPPLJ'
    }, (accessToken, refreshToken, profile, done) => {
        //console.log(accessToken)
        //Check if user exists in db
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                //already exist
                console.log("User exists:", currentUser)
                done(null, currentUser);
            }
            else {
                //create user in our db
                //Add User
                new User({
                    username: profile.emails[0].value.substring(0, profile.emails[0].value.indexOf('@')),
                    googleId: profile.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    name: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value
                }).save().then((newUser) => {
                    console.log('new user created' + newUser)
                    done(null, newUser);
                })
            }
        });
    }
    ));