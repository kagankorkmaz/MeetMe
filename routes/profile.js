const router = require('express').Router();


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
    res.render('profile',{user:req.user});
});

router.get('/editProfile', (req,res) => {
    res.render('editprofile');
})


module.exports = router;