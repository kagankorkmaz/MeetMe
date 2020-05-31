var path = require("path");
const User = require("../models/User");
const Poll = require("../models/Poll");
const Meeting = require("../models/Meeting");
const passport = require('passport');
const { update, base } = require("../models/User");
const { func } = require("prop-types");
const { merge } = require("lodash");
const arrayUniq = require('array-uniq');
const _ = require('underscore');
const { google } = require('googleapis');
const { searchconsole } = require("googleapis/build/src/apis/searchconsole");
const { surveys } = require("googleapis/build/src/apis/surveys");
const { OAuth2 } = google.auth
require('../authentication/passport/local');
// MAILER
const mailComposer = require('nodemailer/lib/mail-composer');
const readline = require('readline');
const fs = require('fs');
//MAILER

class CreateMail {

    constructor(auth, to, sub, body, task, attachmentSrc) {
        this.me = 'meet308me@gmail.com';
        this.task = task;
        this.auth = auth;
        this.to = to;
        this.sub = sub;
        this.body = body;
        this.gmail = google.gmail({ version: 'v1', auth });
        this.attachment = attachmentSrc;

    }

    //Creates the mail body and encodes it to base64 format.
    makeBody() {

        let mail = new mailComposer({
            to: this.to,
            text: this.body,
            subject: this.sub,
            textEncoding: "base64"
        });

        //Compiles and encodes the mail.
        mail.compile().build((err, msg) => {
            if (err) {
                return console.log('Error compiling email ' + error);
            }

            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            if (this.task === 'mail') {
                this.sendMail(encodedMessage);
            }
            else {
                this.saveDraft(encodedMessage);
            }
        });
    }

    //Send the message to specified receiver.
    sendMail(encodedMessage) {
        this.gmail.users.messages.send({
            userId: this.me,
            resource: {
                raw: encodedMessage,
            }
        }, (err, result) => {
            if (err) {
                return console.log('NODEMAILER - The API returned an error: ' + err);
            }

            console.log("NODEMAILER - Sending email reply from server:", result.data);
        });
    }

    //Saves the draft.
    saveDraft(encodedMessage) {
        this.gmail.users.drafts.create({
            'userId': this.me,
            'resource': {
                'message': {
                    'raw': encodedMessage
                }
            }
        })
    }

    //Deletes the draft.
    deleteDraft(id) {
        this.attachment.gmail.users.drafts.delete({
            id: id,
            userId: this.me
        });
    }

    //Lists all drafts.
    listAllDrafts() {
        this.gmail.users.drafts.list({
            userId: this.me
        }, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                //console.log(res.data);
            }
        });
    }
}

function mail(recipients, condition) {
    const oAuth2Client = new OAuth2( //bunu dışardan mı alsak
        '805012118741-vvgvhls19vs9d10boh9k156qe6k08h3e.apps.googleusercontent.com',
        'IvdjL5wmHFDPNFa4YXElPPLJ'
    )

    refreshtoken = '1//04GUdlB-716d6CgYIARAAGAQSNwF-L9IrRpaqFxMPR_eyRyucfqCSW2vEL_ueA-qamcQ5lR7A4GG5H5-oHt3iL6DwUDsfWaHYwiI';

    oAuth2Client.setCredentials({ refresh_token: refreshtoken });

    if (condition == 0) {
        var subject = "Vote to Set a Meeting!";
        var mailBody = "A new poll has been opened! Vote to set the meeting time.";
    }
    if (condition == 1) {
        var subject = "New Meeting in Your Calendar!";
        var mailBody = "You have a new meeting in your calendar. Check details.";
    }

    var obj = new CreateMail(oAuth2Client, recipients, subject, mailBody, 'mail');
    //'mail' is the task, if not passed it will save the message as draft.
    obj.makeBody();
    //This will send the mail to the recipent.
}

async function updateDatabase2(mergedCalender, myUser) {

    let updatedValues = {
        calender: mergedCalender
    };

    //console.log("heyoho");
    //console.log(updatedValues);

    await User.updateOne({ email: myUser.email }, updatedValues)
        .then(User => {
            if (!User) { return res.status(404).end(); }
        })
        .catch(err => next(err));

    return updatedValues;

}

async function listEvent2(oAuth2Client, refreshtoken, myUser) {

    oAuth2Client.setCredentials({
        refresh_token: refreshtoken,
    })

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    var toDB = [];
    var item = [];

    await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            events.map((event, i) => {
                var start = event.start.dateTime || event.start.date;
                var end = event.end.dateTime || event.end.date;
                
                //////MODIFY GOOGLE CALENDAR TIME //////



                start = start.slice(0, 16);
                if (start.search("T")) {
                    start = start.replace("T", " ");
                }

                end = end.slice(0, 16);
                if (end.search("T")) {
                    end = end.replace("T", " ");
                }

                ///////////
                var summary = "";

                if (event.summary) {
                    item = { "start_date": start, "end_date": end, "text": event.summary };
                }
                else {
                    item = { "start_date": start, "end_date": end, "text": "No title from Google" };
                }

                //console.log("item");
                //console.log(item);
                toDB.push(item);
            });

            //console.log(toDB);
            toDB = JSON.stringify(toDB);
            //console.log(toDB);

            if (myUser.calender != '') {
                
                var baseCalender = myUser.calender;
               
                toDB = JSON.parse(toDB);
                
                var baseCalender = JSON.parse(baseCalender);
                
                var temp = toDB.concat(baseCalender);

                var temp2 = Array.from(new Set(temp.map(JSON.stringify))).map(JSON.parse);
                
                var mergedCalender = JSON.stringify(temp2);
                
                updateDatabase2(mergedCalender, myUser);
                return mergedCalender;
            }

            else {
                var mergedCalender = toDB;
                updateDatabase2(mergedCalender, myUser);
                return mergedCalender
            }


            //burda toDB 'yi database'e yazmamız gerekli
        } else {
            console.log('No upcoming events found.');
            return -1;
        }
    });



}



module.exports.getUserLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};

module.exports.getUserRegister = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
};



module.exports.postUserLogin = (req, res, next) => {
   
    passport.authenticate("local", {
        successRedirect: "/profile",                        //DEĞİŞECEK ///////////////////////////////
        failureRedirect: "/login",
        failureFlash: true,                     // DİKKAT
        successFlash: true                    // DİKKAT
    })(req, res, next);
};



module.exports.postUserRegister = (req, res, next) => {
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
        poll: '',
        meeting: ''
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
    
    dummyBool = JSON.parse(req.body.myData);
    dummyBool = dummyBool.dummyBool;
   
    //console.log(req);
    const { google } = require('googleapis');
    const { OAuth2 } = google.auth


    //listEvent(oAuth2Client, refreshtoken)

    // Calculating busy times
    if (dummyBool == "1") {
        async function main() {
            const oAuth2Client = new OAuth2(
                '805012118741-vvgvhls19vs9d10boh9k156qe6k08h3e.apps.googleusercontent.com',
                'IvdjL5wmHFDPNFa4YXElPPLJ'
            )

            // globMTitle = await req.body.myData.Mtitle;
            // globMDesc = await req.body.myData.MDesc;
            // globMails = await req.body.myData.Mails;


            mails = JSON.parse(req.body.myData);
            mails = mails.Mails;
            var userCalendars = [];
            mails.push(req.user.email);
            //console.log("susus");
            //console.log(typeof (mails));
            //console.log(mails);

            for (email of mails) {
                await User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        //console.log(user.name);
                        //console.log(user.calender);
                        //userCalendars.push(user.calender)
                        //console.log("aaaaaaaaaaaaaaer");
                        //console.log(user)
                        listEvent2(oAuth2Client, user.refreshToken, user);
                        //console.log(user.name);
                        //console.log(user.calender);
                    }
                }).catch(err => console.log(err));
            }



            for (email of mails) {
                await User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        //console.log(user.name);
                        //console.log(user.calender);
                        userCalendars.push(user.calender)
                        //console.log(user.name);
                        //console.log(user.calender);
                    }
                }).catch(err => console.log(err));
            }


            //console.log(req.user);

            //console.log("1");
            //console.log(userCalendars);
            //console.log("2");

            console.log("calculating busy times...");

            var datesGMT = [];
            var currEv = new Date()
            var endEv = new Date();
            var i, k;
            for (k = 0; k < userCalendars.length; k++) {
                var JSON_array = [];
                console.log(userCalendars[k]);
                console.log(typeof(userCalendars[k]));

                console.log(JSON.stringify(userCalendars[k]));
                console.log(typeof(JSON.stringify(userCalendars[k])));
                // EDITED BY KK
                if(JSON.stringify(userCalendars[k]) != "[]"){
                    console.log("NOT empty calender");
                    var JSON_array = JSON.parse(userCalendars[k]);
                }
                //
               
                for (i = 0; i < JSON_array.length; i++) {
                    currEv = new Date(JSON_array[i].start_date);
                    if (datesGMT.map(Number).indexOf(+currEv) == -1) {
                        datesGMT.push(currEv);
                    }
                    currEv = new Date(JSON_array[i].end_date);
                    if (datesGMT.map(Number).indexOf(+currEv) == -1) {
                        datesGMT.push(currEv);
                    }
                    endEv = new Date(JSON_array[i].end_date);
                    endEv.setSeconds(endEv.getSeconds() + 1);
                    if (datesGMT.map(Number).indexOf(+endEv) == -1) {
                        datesGMT.push(endEv);
                    }
                }
            }

            var date_sort_asc = function (date1, date2) {
                if (date1 > date2) return 1;
                if (date1 < date2) return -1;
                return 0;
            };

            var date_sort_desc = function (date1, date2) {
                if (date1 > date2) return -1;
                if (date1 < date2) return 1;
                return 0;
            };

            datesGMT.sort(date_sort_asc);

            var beginDayTime = new Date(datesGMT[0]);
            beginDayTime.setHours(0);
            beginDayTime.setMinutes(0);
            beginDayTime.setSeconds(0);
            datesGMT.unshift(beginDayTime);
            var endDayTime = new Date(datesGMT[datesGMT.length - 1]);
            endDayTime.setHours(23);
            endDayTime.setMinutes(59);
            endDayTime.setSeconds(59);
            datesGMT.push(endDayTime);

            console.log(datesGMT);

            var dict = {};
            var j;
            for (j = 0; j < datesGMT.length; j++) {
                dict[datesGMT[j]] = j;
            }
            //console.log(dict);

            var arr = Array(userCalendars.length).fill(null).map(() => Array(datesGMT.length).fill(0));

            for (k = 0; k < userCalendars.length; k++) {
                //var JSON_array = JSON.parse(userCalendars[k]);
                var JSON_array = [];
                if(JSON.stringify(userCalendars[k]) != "[]"){
                    console.log("NOT empty calender");
                    var JSON_array = JSON.parse(userCalendars[k]);
                }
                
                for (i = 0; i < JSON_array.length; i++) {
                    for (j = dict[new Date(JSON_array[i].start_date)]; j < dict[new Date(JSON_array[i].end_date)] + 1; j++) {
                        arr[k][j] = 1;
                    }
                    //console.log(dict[new Date(JSON_array.events[i].end_date)]);
                }
            }

            //console.log(arr);
            var busyTimeIndex = [];
            var u;
            for (i = 0; i < arr[0].length; i++) {
                for (j = 0; j < arr.length; j++) {
                    if (arr[j][i] === 1) {
                        busyTimeIndex.push(i);
                        break;
                    }
                }
            }

            //console.log(busyTimeIndex);

            var busyTime = {};
            var slots = [];
            busyTime.slots = slots;

            var count;
            console.log('Busy time slots are:');
            for (i = 0; i < busyTimeIndex.length - 1; i++) {

                count = i;
                while (busyTimeIndex.includes(busyTimeIndex[i] + 1)) {
                    i = i + 1;
                }

                console.log(datesGMT[busyTimeIndex[count]] + ' - ' + datesGMT[busyTimeIndex[i]])

                var slot = {
                    "start_date": datesGMT[busyTimeIndex[count]],
                    "end_date": datesGMT[busyTimeIndex[i]]
                }

                busyTime.slots.push(slot);
            }



            //console.log(JSON.stringify(busyTime));
            //console.log()
            var fs = require('fs');

            // fs.writeFile('./busyTimeSlots.json', JSON.stringify(busyTime, null, 2), err => {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log('File successfully written!')
            //     }

            // });

            console.log("Busy times calculated");

            //res.redirect("/profile/addcalender2");
            //console.log(JSON.parse(req.body.myData));
            var parsedData = JSON.parse(req.body.myData);
            //console.log(parsedData.MTitle);
            //console.log("kokorec");
            //console.log(busyTime);
            //console.log(busyTime.slots);
            //console.log(mails);
            //console.log(typeof (mails));


            res.render("calendermeet2",
             { data: { 
                 title: parsedData.MTitle,
                  desc: parsedData.MDesc, 
                  busyTimes: JSON.stringify(busyTime.slots), 
                  mails: JSON.stringify(mails), 
                  host: parsedData.host,
                  medium: parsedData.medium,
                  location: parsedData.location,
                  recurance: parsedData.recurance,
                  link: parsedData.link
                } });
            return userCalendars;
        }

        main();
    }

    //Create poll
    else {
        
        myData = JSON.parse(req.body.myData);
        
        async function savePoll() {
            //Adding to Poll Collection
            const newPoll = new Poll({
                voterCount: myData.votercount,
                voters: myData.voters,
                polls: JSON.stringify(myData.polls)
            })

           
            await newPoll.save().then(() => {
                console.log("DB save poll Succesful");
                req.flash("flashSuccess", "Succesfully Registered");

            }).catch(err => console.log(err));




            //Adding to users' polls
            for (email of myData.polls[0].mails) {
                let arr = [];
                arr.push(newPoll._id);

                arr2 = { poll: arr };

                await User.findOne({ email: email }).then(myUser => {
                    if (!myUser) {
                        return res.status(404).end();
                    }

                    else {
                        var userPoll = myUser.poll;

                        if (userPoll == "") {
                            async function updateBos() {
                                var updatedValues = {
                                    poll: JSON.stringify(arr2)
                                }
                                await User.updateOne({ email: myUser.email }, updatedValues).then(User => {
                                    if (!User) { return res.status(404).end(); }
                                })
                                    .catch(err => next(err));
                            }

                            updateBos();
                        }

                        else {
                            async function updateDolu() {
                                var userPoll2 = JSON.parse(userPoll);
                                userPoll2 = userPoll2.poll;
                                for (item of userPoll2) {
                                    arr2.poll.push(item);
                                    arr2.poll = [...new Set(arr2.poll)];
                                }
                                updatedValues2 = {
                                    poll: JSON.stringify(arr2)
                                }
                                await User.updateOne({ email: myUser.email }, updatedValues2).then(User => {
                                    if (!User) { return res.status(404).end(); }
                                })
                                    .catch(err => next(err));
                            }
                            updateDolu();
                        }
                        mail(myUser.email, 0);
                    }
                })
            }
            res.redirect("/profile/polls");
        }
        savePoll();
    }
};

module.exports.googleCalendarSync = (req, res) => {
    


    const fs = require('fs');
    const readline = require('readline');


    const oAuth2Client = new OAuth2(
        '805012118741-vvgvhls19vs9d10boh9k156qe6k08h3e.apps.googleusercontent.com',
        'IvdjL5wmHFDPNFa4YXElPPLJ'
    )

    refreshtoken = req.user.refreshToken;

    async function updateDatabase(mergedCalender) {

        let updatedValues = {
            calender: mergedCalender
        };


        await User.updateOne({ email: req.user.email }, updatedValues)
            .then(User => {
                if (!User) { return res.status(404).end(); }
            })
            .catch(err => next(err));

        //console.log("\n\n\n\nAAAAAAAAAAAAAAAAAAAA\n\n\n\n\n\n")
        return updatedValues;

    }

    var myUser = req.user;

    listEvent2(oAuth2Client, refreshtoken, myUser);
}



module.exports.getpolls = (req, res, next) => {

    

    async function main() {
        pollsArr = [];
        idArr = [];
        
        if (!req.user.poll) {
            pollsArr.push("");
            idArr.push("");
            res.render('poll', { data: { pollsArr: JSON.stringify(pollsArr), idArr: idArr, user:req.user } });
            return -1;
        }

        userPoll = JSON.parse(req.user.poll);
        userPolls = userPoll.poll;
        for (pollID of userPolls) {
            //Her bir pollID string olarak alınıyo
            await Poll.findOne({
                _id: pollID
            }).then(Poll => {
                if (Poll) {
                    //console.log("poll found");
                    pollsArr.push(Poll);
                    idArr.push(pollID);
                }

                else {
                    //console.log("poll not found")
                }
            }).catch(err => console.log(err));
        }

        for (item of pollsArr) {
            item.polls = JSON.parse(item.polls);
        }
        console.log(JSON.stringify(pollsArr.polls));
        console.log(pollsArr[0].polls[0]);
        res.render('poll', { data: { pollsArr: JSON.stringify(pollsArr), idArr: idArr, user:req.user } });
    }

    main();
};



module.exports.postpolls = (req, res, next) => {

    async function main() {
        myData = JSON.parse(req.body.myData);
        console.log(myData);


        //Delete from user's poll
        var deleteID = myData._id;
        

        userPoll = JSON.parse(req.user.poll);
        

        var index = userPoll.poll.indexOf(deleteID);
        if (index !== -1) userPoll.poll.splice(index, 1);

       

        toDBPoll = { poll: userPoll.poll }

        updatedValues = {
            poll: JSON.stringify(toDBPoll)
        }

        await User.updateOne({ email: req.user.email }, updatedValues)
            .then(User => {
                if (!User) { return res.status(404).end(); }
            })
            .catch(err => next(err));

        


        //Deletin poll object if it is completed and adding it to meeting database
        if (myData.voterCount == myData.voters) {

            var highest = 0;
            var high=0;
            for (var i = 0; i < myData.polls.length; i++) {
                if (myData.polls[i].vote > highest) {
                    high = i;
                    highest = myData.polls[i].vote;
                }
            }


            console.log(myData);
            console.log(high);
            const newMeeting = new Meeting({
                title: myData.polls[high].title,
                description: myData.polls[high].description,
                mails: myData.polls[high].mails,
                medium: myData.polls[high].medium,
                location: myData.polls[high].location,
                link: myData.polls[high].link,
                recurrance: myData.polls[high].recurrance,
                host: myData.polls[high].host,
                start_date: myData.polls[high].start_date,
                end_date: myData.polls[high].end_date,
                vote: myData.polls[high].vote
            })

            await newMeeting.save().then(() => {
                console.log("DB save meeting Succesful");
                req.flash("flashSuccess", "Succesfully Registered");

            }).catch(err => console.log(err));

            const newToCalender ={
                start_date: myData.polls[high].start_date,
                end_date: myData.polls[high].end_date,
                title: myData.polls[high].title,
                _id : newMeeting._id
            }

            //////////////// ADD TO USER MEETİNGs ////////

            for (email of myData.polls[high].mails) {
                let arrM = [];
                arrM.push(newMeeting._id);

                arrM2 = { meeting: arrM };

                await User.findOne({ email: email }).then(myUser => {
                    if (!myUser) {
                        return res.status(404).end();
                    }

                    else {
                        var userMeeting = myUser.meeting;
                        if (userMeeting == "") {
                            async function updateBosMeeting() {
                                var updatedValues = {
                                    meeting: JSON.stringify(arrM2)
                                }
                                await User.updateOne({ email: myUser.email }, updatedValues).then(User => {
                                    if (!User) { return res.status(404).end(); }
                                })
                                    .catch(err => next(err));
                            }
                            updateBosMeeting();
                        }
                        else {
                            async function updateDoluMeeting() {
                                var userMeeting2 = JSON.parse(userMeeting);
                                userMeeting2 = userMeeting2.meeting;

                                for (item of userMeeting2) {
                                    arrM2.meeting.push(item);
                                    arrM2.meeting = [...new Set(arrM2.meeting)];
                                }

                                updatedValues2 = {
                                    meeting: JSON.stringify(arrM2)
                                }
                                await User.updateOne({ email: myUser.email }, updatedValues2).then(User => {
                                    if (!User) { return res.status(404).end(); }
                                })
                                    .catch(err => next(err));
                            }
                            updateDoluMeeting();
                        }

                        async function updateCalender(){
                            var newCalender;
                            if(myUser.calender == "" || myUser.calender == "[]"){
                                newCalender= [];
                                newCalender.push(newToCalender)
                            }
                            else{
                                userCalender = JSON.parse(myUser.calender);
                                userCalender.push(newToCalender);
                                newCalender= userCalender;
                
                            }
                            let updatedValues = {
                                calender: JSON.stringify(newCalender)
                            };
                
                            await User.updateOne({email: myUser.email}, updatedValues)
                                .then(User => {
                                    if (!User) { return res.status(404).end(); }
                                })
                                .catch(err => next(err));
                        }
                        updateCalender();
                        mail(myUser.email, 1);
                    }
                })
            }

            /////////////////////////////////////////////


            await Poll.deleteOne({ _id: deleteID }, function (err, result) {
                if (err) {
                    console.log("Error on deleting from Polls");
                }
                else {
                    //console.log("Deleting from polls Successfull")
                }
            });

        }


        else {
            updatedValues2 = {
                voters: myData.voters,
                polls: JSON.stringify(myData.polls)
            }

            await Poll.updateOne({ _id: deleteID }, updatedValues2)
                .then(Poll => {
                    if (!Poll) { return res.status(404).end(); }
                    else {
                        //console.logconsole.log("poll buldu");
                    }
                })
                .catch(err => next(err));
        }




        res.redirect("/profile/polls");

    }

    main();
};

module.exports.getmeetings = (req, res, next) => {

   

    async function main() {
      
        meetingsArr = [];
        if (!req.user.meeting) {
            
            meetingsArr.push("");
           
            res.render('meet', { data: { meetingsArr: JSON.stringify(meetingsArr) } });
            return -1;
        }
        
        userMeeting = JSON.parse(req.user.meeting);
        userMeetings = userMeeting.meeting;

        for (meetingID of userMeetings) {
            //Her bir pollID string olarak alınıyo
            await Meeting.findOne({
                _id: meetingID
            }).then(Meeting => {
                if (Meeting) {
                    //console.log("Meeting found");
                    meetingsArr.push(Meeting);
                    //idArr.push(pollID);
                }
                else {
                    //console.log("meeting not found")
                }
            }).catch(err => console.log(err));
        }


        res.render('meet', { data: { meetingsArr: JSON.stringify(meetingsArr) } });
    }

    main();

};

module.exports.getHosted = (req, res, next) => {
    async function main() {
        hostedMeetingsArr=[];
        hostedPollsArr=[];
        hostedIdArr=[];
        
        // Getting meetings
        meetingsArr = [];
        var userMeetings = null;
        if(req.user.meeting != ""){
            userMeeting = JSON.parse(req.user.meeting);
            userMeetings = userMeeting.meeting;
            for (meetingID of userMeetings) {
                //Her bir pollID string olarak alınıyo
                await Meeting.findOne({
                    _id: meetingID
                }).then(Meeting => {
                    if (Meeting) {
                        //console.log("Meeting found");
                        meetingsArr.push(Meeting);
                        //idArr.push(pollID);
                    }
                    else {
                        //console.log("meeting not found")
                    }
                }).catch(err => console.log(err));
            }
    
            for (item of meetingsArr){
                if(req.user.email == item.host)
                    hostedMeetingsArr.push(item);
            }
        }
        
        
        
        //Getting Polls
        pollsArr = [];
        idArr = [];
        if(req.user.polls != ""){
            userPoll = JSON.parse(req.user.poll);
            userPolls = userPoll.poll;
            for (pollID of userPolls) {
                //Her bir pollID string olarak alınıyo
                await Poll.findOne({
                    _id: pollID
                }).then(Poll => {
                    if (Poll) {
                        //console.log("poll found");
                        pollsArr.push(Poll);
                        idArr.push(pollID);
                    }
    
                    else {
                        //console.log("poll not found")
                    }
                }).catch(err => console.log(err));
            }
    
            for (item of pollsArr) {
                item.polls = JSON.parse(item.polls);
            }
    
            for(let i =0; i< pollsArr.length; i++){
                if(req.user.email == pollsArr[i].polls[0].host){
                    hostedPollsArr.push(pollsArr[i])
                    hostedIdArr.push(idArr[i]);
                }
            }
        }
        
       
        
        console.log(hostedMeetingsArr);
        // console.log(hostedPollsArr);
        // console.log(hostedIdArr);
        

        // userCalender = JSON.parse(req.user.calender)
        // userCalender.push({
        //     start_date: '2020-05-31 07:40',
        //     end_date: '2020-05-31 09:30',
        //     text: 'New event'})
        //console.log(userCalender);
        
        

        // async function updateTemp(){
        //     var newCalender;
        //     if(req.user.calender == "" || req.user.calender == "[]"){
        //         newCalender= [];
        //         newCalender.push({
        //                 start_date: '2020-05-31 07:40',
        //                 end_date: '2020-05-31 09:30',
        //                 text: 'New event'})
        //     }
        //     else{
        //         userCalender = JSON.parse(req.user.calender);
        //         userCalender.push({
        //             start_date: '2020-05-31 05:40',
        //             end_date: '2020-05-31 07:30',
        //             text: 'New event'});
        //         newCalender= userCalender;

        //     }
        //     let updatedValues = {
        //         calender: JSON.stringify(newCalender)
        //     };

        //     await User.updateOne({email: req.user.email}, updatedValues)
        //         .then(User => {
        //             if (!User) { return res.status(404).end(); }
        //         })
        //         .catch(err => next(err));
        // }

        // updateTemp();
        
        res.render('hosted', { data: { pollsArr: JSON.stringify(hostedPollsArr), meetingsArr: JSON.stringify(hostedMeetingsArr) , idArr: JSON.stringify(hostedIdArr), user:req.user } });    }

    main();

};

module.exports.postHostedSingle1 = (req, res, next) => {
    myDataBase = JSON.parse(req.body.myData);
    
    async function updateMeeting(id, updatedValues){
        await Meeting.updateOne({_id: id}, updatedValues)
            .then(Meet => {
                if (!Meet) { return res.status(404).end(); }
            })
            .catch(err => next(err));
    }
    
    async function updateUserCalender(id,updatedMeeting,mails){
        
        async function toUserCalender(user, updatedValues){
            console.log('e')
            console.log(updatedValues);
            console.log(user);
            await User.updateOne({email:user.email}, updatedValues)
                .then(x => {
                    if (!x) { return res.status(404).end(); }
                })
                .catch(err => next(err));
        }

        ;
        for(item of mails){
            await User.findOne({
                email: item
            }).then(user =>{
                if(user){
                    
                    userCalender = JSON.parse(user.calender);
                    var updatedValues;
                    for(let i=0; i<userCalender.length; i++){
                        if( ("_id" in userCalender[i] && userCalender[i]._id == id)){
                            console.log('d');
                            console.log(userCalender[i]);
                            updatedMeeting.id = id;
                            userCalender[i]=updatedMeeting;
                            updatedValues = {calender: JSON.stringify(userCalender)}
                            console.log(updatedValues);
                            
                            // User.updateOne({email:user.email}, updatedValues)
                            //     .then(x => {
                            //         if (!x) { return res.status(404).end(); }
                            //     })
                            //     .catch(err => next(err));
                        }
                    }
                    console.log(updatedValues);
                    toUserCalender(user, updatedValues);

                }
            }).catch(err => console.log(err));
        }
    }

    async function main() {
        myData = JSON.parse(req.body.myData);
        console.log(myData);
        console.log("AAAAAA");
        console.log(myData.data.polls[0]);
        var mails;
        if(myData.type == "meeting"){
            mails = myData.data.mails;
        }
        else{
            // console.log(myData.data.polls[0]);
            // console.log(typeof myData.data.polls);

            mails = myData.data.polls[0].mails;
        }

        // console.log(mails);


        // CALCULATING BUSY TIMES
        const { google } = require('googleapis');
        const { OAuth2 } = google.auth;
        var userCalendars = [];

        for (email of mails) {
            await User.findOne({
                email: email
            }).then(user => {
                if (user) {
                    listEvent2(oAuth2Client, user.refreshToken, user);
                }
            }).catch(err => console.log(err));
        }
        for (email of mails) {
            await User.findOne({
                email: email
            }).then(user => {
                if (user) {
                    //console.log(user.name);
                    //console.log(user.calender);
                    userCalendars.push(user.calender)
                    //console.log(user.name);
                    //console.log(user.calender);
                }
            }).catch(err => console.log(err));
        }

        var datesGMT = [];
        var currEv = new Date()
        var endEv = new Date();
        var i, k;
        for (k = 0; k < userCalendars.length; k++) {
            var JSON_array = [];
            // console.log(userCalendars[k]);
            // console.log(typeof(userCalendars[k]));

            // console.log(JSON.stringify(userCalendars[k]));
            // console.log(typeof(JSON.stringify(userCalendars[k])));
            // EDITED BY KK
            if(JSON.stringify(userCalendars[k]) != "[]"){
                // console.log("NOT empty calender");
                var JSON_array = JSON.parse(userCalendars[k]);
            }
            //
           
            for (i = 0; i < JSON_array.length; i++) {
                currEv = new Date(JSON_array[i].start_date);
                if (datesGMT.map(Number).indexOf(+currEv) == -1) {
                    datesGMT.push(currEv);
                }
                currEv = new Date(JSON_array[i].end_date);
                if (datesGMT.map(Number).indexOf(+currEv) == -1) {
                    datesGMT.push(currEv);
                }
                endEv = new Date(JSON_array[i].end_date);
                endEv.setSeconds(endEv.getSeconds() + 1);
                if (datesGMT.map(Number).indexOf(+endEv) == -1) {
                    datesGMT.push(endEv);
                }
            }
        }

        var date_sort_asc = function (date1, date2) {
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
            return 0;
        };

        var date_sort_desc = function (date1, date2) {
            if (date1 > date2) return -1;
            if (date1 < date2) return 1;
            return 0;
        };

        datesGMT.sort(date_sort_asc);

        var beginDayTime = new Date(datesGMT[0]);
        beginDayTime.setHours(0);
        beginDayTime.setMinutes(0);
        beginDayTime.setSeconds(0);
        datesGMT.unshift(beginDayTime);
        var endDayTime = new Date(datesGMT[datesGMT.length - 1]);
        endDayTime.setHours(23);
        endDayTime.setMinutes(59);
        endDayTime.setSeconds(59);
        datesGMT.push(endDayTime);

        console.log(datesGMT);

        var dict = {};
        var j;
        for (j = 0; j < datesGMT.length; j++) {
            dict[datesGMT[j]] = j;
        }
        //console.log(dict);

        var arr = Array(userCalendars.length).fill(null).map(() => Array(datesGMT.length).fill(0));

        for (k = 0; k < userCalendars.length; k++) {
            //var JSON_array = JSON.parse(userCalendars[k]);
            var JSON_array = [];
            if(JSON.stringify(userCalendars[k]) != "[]"){
                // console.log("NOT empty calender");
                var JSON_array = JSON.parse(userCalendars[k]);
            }
            
            for (i = 0; i < JSON_array.length; i++) {
                for (j = dict[new Date(JSON_array[i].start_date)]; j < dict[new Date(JSON_array[i].end_date)] + 1; j++) {
                    arr[k][j] = 1;
                }
                //console.log(dict[new Date(JSON_array.events[i].end_date)]);
            }
        }

        //console.log(arr);
        var busyTimeIndex = [];
        var u;
        for (i = 0; i < arr[0].length; i++) {
            for (j = 0; j < arr.length; j++) {
                if (arr[j][i] === 1) {
                    busyTimeIndex.push(i);
                    break;
                }
            }
        }

        //console.log(busyTimeIndex);

        var busyTime = {};
        var slots = [];
        busyTime.slots = slots;

        var count;
        console.log('Busy time slots are:');
        for (i = 0; i < busyTimeIndex.length - 1; i++) {

            count = i;
            while (busyTimeIndex.includes(busyTimeIndex[i] + 1)) {
                i = i + 1;
            }

            console.log(datesGMT[busyTimeIndex[count]] + ' - ' + datesGMT[busyTimeIndex[i]])

            var slot = {
                "start_date": datesGMT[busyTimeIndex[count]],
                "end_date": datesGMT[busyTimeIndex[i]]
            }

            busyTime.slots.push(slot);
        }



        //console.log(JSON.stringify(busyTime));
        //console.log()
        var fs = require('fs');
        
        console.log(JSON.stringify(busyTime.slots));


            res.render("edit2", {data: {
                 busyTimes: JSON.stringify(busyTime.slots),
                 baseData: JSON.stringify(myData),
                 user: req.user
            }})
    }
    async function main2(){
        console.log("Main2")
        myData = JSON.parse(req.body.myData);
        console.log(myData);

       let id= myData.data._id;
       delete myData.data._id;

       
       
       updateMeeting(id, myData.data)
       updateUserCalender(id, myData.data, myData.data.mails);


    }

    async function main3(){
        myData = JSON.parse(req.body.myData);
        console.log(myData);

        async function main(){
            let updatedValues= {
                voterCount:myData.data.votercount,
                voters: myData.data.voters,
                created: myData.data.created,
                polls: JSON.stringify(myData.data.polls)
            }
            console.log(updatedValues);
            Poll.updateOne({_id: myData.data._id}, updatedValues)
            .then(Poll => {
                if (!Poll) { return res.status(404).end(); }
                else {
                    console.log("poll buldu");
                }
                res.redirect('/profile/hosted');
            })
            .catch(err => next(err));
            
        }

        main();
    }
    
    if(myDataBase.dummyBool == 1){
        main();
    }
    else if(myDataBase.dummyBool == 2 && myDataBase.type == "meeting"){
        main2();
    }
    else if(myDataBase.dummyBool == 2 && myDataBase.type == "poll"){
        main3();
    }
    

};
