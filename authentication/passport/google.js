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
        //passport callback function
        console.log('passport callback function called');
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
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('new user created' + newUser)
                    done(null, newUser);
                })
            }


        });



    }
    ));