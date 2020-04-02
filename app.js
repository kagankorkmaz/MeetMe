const express = require('express');
const userRouter = require("./routes/users");
const profileRouter = require('./routes/profile');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require ("passport");
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const User = require('./models/User');
const cookieSession = require('cookie-session');
const googlesetup = require('./authentication/passport/google')
keys = require('./config/keys');
//Passport config
//require('./authentication/config/passport')(passport);

//require('./authentication/passport/local')(passport);

//MOngoDB connection
const db =  require('./config/keys').mongoURI;

//connect to mongo  
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

 
const app = express();
const PORT = 3000 || process.env.PORT;


app.use(cookieSession({
 maxAge:24 * 60 * 60 * 1000,
 keys: [keys.session.cookieKey]
}));




//Flash Mİddlewares
app.use(cookieParser('MeetMe'));
//app.use(session({cookie: {maxAge: 60000},resave: true, secret: "MeetMe", saveUninitialized: true}));
app.use(flash());

//Passport initiliaze
app.use(passport.initialize());
app.use(passport.session());

//Global Res.locals
app.use((req,res,next) => {
    // Our own flash
    res.locals.flashSuccess = req.flash("Flash Success");
    res.locals.flashError = req.flash("flashError");

    // Passport flash
    res.locals.passportFailure = req.flash("error");
    res.locals.passportSuccess = req.flash("success");

    //OUR LOGGED USER
    res.locals.user = req.user;
    next(); 
});


app.use(express.static("public"));
  
//Router Middleware
app.use(userRouter);
app.use('/profile', profileRouter);

//BodyOarser MiddleWare
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json()); 



app.get("/", (req, res, next) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

// app.use((req, res, next) => {
//     res.send("404 NOT FOUND")
// })

app.listen(PORT, () => {
    console.log("App Started")
});

