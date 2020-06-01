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
    userController.googleCalendarSync(req,res);
    res.render('profile',{user:req.user});
});

router.get('/editProfile', (req,res) => {
    res.render('editprofile');
})

router.get('/logout', (req,res) => {
    res.send("logging out");
})

router.post('/editProfile', urlencodedParser, userController.postUserEdit);

router.get('/calender', (req,res) => {
    res.render('new_calender',{user:req.user});
})

router.post('/calender', urlencodedParser, userController.postCalender);

router.get('/addcalender', (req,res) => {
    res.render('calendermeet',{user:req.user});
})

router.post('/addcalender', userController.postCalenderMeet);

router.get('/polls', userController.getpolls);

router.post('/polls', userController.postpolls);

router.get('/meetings', userController.getmeetings);

router.get('/mypoll', (req,res) =>{
    res.render('mypoll', {user:req.user});
} );

router.post('/mypoll', userController.postpolls);

router.get('/hosted', userController.getHosted);

router.post('/hosted', userController.postHosted);

router.get('/hostedSingle', (req,res) =>{
    res.render('edit', {user:req.user});
} );

router.post('/hostedSingle', userController.postHostedSingle1);




module.exports = router;