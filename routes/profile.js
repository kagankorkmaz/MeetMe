const router = require('express').Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const userController = require('../controllers/userController');


const authCheck = (req,res,next) => {
    if(!req.user){
        //if user is not logged in
        res.redirect('/login');
    }else{
        //if logged in
        next();
    }
};

router.get('/', authCheck, (req,res) => {
    //res.send('You are logged inasd asd - ' + req.user.username);
    //console.log(req.user);
    userController.googleCalendarSync(req,res);
    res.render('profile',{user:req.user});
});

router.get('/editProfile', (req,res) => {
    //console.log(req.user);
    res.render('editprofile');
})

router.get('/logout', (req,res) => {
    res.send("logging out");
})

router.post('/editProfile', urlencodedParser, userController.postUserEdit);



router.get('/calender', (req,res) => {
    //console.log(req.user);
    
    console.log(req.user);
    
    res.render('calender',{user:req.user});
})

router.post('/calender', urlencodedParser, userController.postCalender);



router.get('/addcalender', (req,res) => {
    //console.log(req.user);
    
    res.render('calendermeet',{user:req.user});
})

router.post('/addcalender', userController.postCalenderMeet);

// router.get('/addcalender2', (req,res) => {
//     //console.log(req.user);
    
//     res.render('calendermeet2',{user:req.user});
// })

router.get('/polls', userController.getpolls);

router.post('/polls', userController.postpolls);

router.get('/meetings', userController.getmeetings);



module.exports = router;