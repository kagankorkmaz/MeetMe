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
                console.log(res.data);
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
                console.log(event.summary);
                console.log("gugıl");
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
                //console.log("IFICICICICIC");
                var baseCalender = myUser.calender;
                //console.log(baseCalender);
                toDB = JSON.parse(toDB);
                //console.log(typeof myUser.calender);
                //console.log(myUser.calender);
                var baseCalender = JSON.parse(baseCalender);
                //console.log(baseCalender);
                //console.log(typeof toDB);
                //console.log("basecalender");
                //console.log(baseCalender);
                //console.log(typeof baseCalender);

                var temp = toDB.concat(baseCalender);

                //temp = _.uniq(temp);


                var temp2 = Array.from(new Set(temp.map(JSON.stringify))).map(JSON.parse);
                //console.log("temp2")
                //console.log(temp2);
                //console.log(typeof temp2);


                //console.log("temp");
                //console.log(temp);



                var mergedCalender = JSON.stringify(temp2);
                //console.log(mergedCalender);
                //res.redirect("/profile/calender");
                //console.log("merged calender");
                //console.log(mergedCalender);

                //console.log(_.uniq([2, 1, 2, 7]));


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

        console.log("post calender");
        console.log(req.body.calender);
        console.log(typeof (req.body.calender));

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
    console.log("POST CALENDAR MEEEET");
    console.log(req.body);
    console.log(req.body.myData);
    dummyBool = JSON.parse(req.body.myData);
    dummyBool = dummyBool.dummyBool;
    console.log(dummyBool);
    console.log(typeof (dummyBool));
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


            res.render("calendermeet2", { data: { title: parsedData.MTitle, desc: parsedData.Mdesc, busyTimes: JSON.stringify(busyTime.slots), mails: JSON.stringify(mails) } });
            return userCalendars;
        }

        main();
    }

    //Create poll
    else {
        console.log("elseteyiz");
        myData = JSON.parse(req.body.myData);
        console.log(myData);
        console.log(myData.polls[0].attendees);

        console.log("xxx");
        console.log(typeof (myData.polls[0].attendees));
        console.log("bosluk");



        async function savePoll() {
            //Adding to Poll Collection
            const newPoll = new Poll({
                voterCount: myData.votercount,
                voters: myData.voters,
                polls: JSON.stringify(myData.polls)
            })

            console.log(newPoll._id);
            await newPoll.save().then(() => {
                console.log("DB save poll Succesful");
                req.flash("flashSuccess", "Succesfully Registered");

            }).catch(err => console.log(err));




            //Adding to users' polls
            for (email of myData.polls[0].attendees) {
                let arr = [];
                arr.push(newPoll._id);

                arr2 = { poll: arr };

                await User.findOne({ email: email }).then(myUser => {
                    if (!myUser) {
                        return res.status(404).end();
                    }

                    else {
                        var userPoll = myUser.poll;

                        // console.log(typeof(JSON.parse(userPoll)));

                        if (userPoll == "") {
                            console.log("bos userpoll")
                            console.log(arr2);


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
                            console.log("dolu userpoll");

                            async function updateDolu() {
                                var userPoll2 = JSON.parse(userPoll);
                                userPoll2 = userPoll2.poll;

                                for (item of userPoll2) {
                                    arr2.poll.push(item);
                                    arr2.poll = [...new Set(arr2.poll)];
                                }

                                console.log(arr2);
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



        // newPoll.save(function (err, result) {
        //     if (err) {
        //         console.log("Error addind Poll")
        //     }
        //     else {
        //         console.log(result._id);
        //         console.log(result);
        //         console.log("DB save Poll Sucessful");

        //     }
        // })

    }

    //res.redirect("/profile/calender");


};

module.exports.googleCalendarSync = (req, res) => {
    console.log("GOOOOOOGLE SYNC");
    console.log(req.user);


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

    console.log("In the polls");
    // console.log(req.user.poll);
    // console.log(typeof(req.user.poll))

    // //console.log(JSON.parse(req.user.poll));

    // userPoll = JSON.parse(req.user.poll);
    // console.log(typeof(userPoll));
    // console.log(userPoll.poll)

    // var x = userPoll.poll[1];
    // console.log(x);
    // console.log(typeof(x));

    async function main() {
        pollsArr = [];
        idArr = [];
        
        if (!req.user.poll) {
            console.log("yeni user poll");
            pollsArr.push("");
            idArr.push("");
            res.render('poll', { data: { pollsArr: JSON.stringify(pollsArr), idArr: idArr } });
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
                    console.log("poll found");
                    pollsArr.push(Poll);
                    idArr.push(pollID);
                }

                else {
                    console.log("poll not found")
                }
            }).catch(err => console.log(err));
        }

        console.log(pollsArr);



        console.log("kokoretto");

        for (item of pollsArr) {
            item.polls = JSON.parse(item.polls);
        }

        //console.log(pollsArr[0].polls)

        //console.log(typeof (pollsArr[0].polls));

        res.render('poll', { data: { pollsArr: JSON.stringify(pollsArr), idArr: idArr } });
    }

    main();
};



module.exports.postpolls = (req, res, next) => {

    console.log("In the post polls");


    async function main() {
        myData = JSON.parse(req.body.myData);
        console.log(myData);
        console.log(req.user);


        //Delete from user's poll
        var deleteID = myData._id;
        console.log(deleteID);

        userPoll = JSON.parse(req.user.poll);
        console.log(userPoll);
        console.log(userPoll.poll);

        var index = userPoll.poll.indexOf(deleteID);
        if (index !== -1) userPoll.poll.splice(index, 1);

        console.log(userPoll.poll);

        toDBPoll = { poll: userPoll.poll }

        updatedValues = {
            poll: JSON.stringify(toDBPoll)
        }

        await User.updateOne({ email: req.user.email }, updatedValues)
            .then(User => {
                if (!User) { return res.status(404).end(); }
            })
            .catch(err => next(err));

        console.log("TUTUU");
        console.log(myData.polls[0]);


        //Deletin poll object if it is completed and adding it to meeting database
        if (myData.voterCount == myData.voters) {

            var highest = 0;
            var high;
            for (var i = 0; i < myData.polls.length; i++) {
                if (myData.polls[i].vote > highest) {
                    high = i;
                    highest = myData.polls[i].vote;
                }
            }



            const newMeeting = new Meeting({
                title: myData.polls[high].title,
                description: myData.polls[high].description,
                attendees: myData.polls[high].attendees,
                start_date: myData.polls[high].start_date,
                end_date: myData.polls[high].end_date,
                vote: myData.polls[high].vote
            })

            //console.log(newMeeting._id);
            await newMeeting.save().then(() => {
                console.log("DB save meeting Succesful");
                req.flash("flashSuccess", "Succesfully Registered");

            }).catch(err => console.log(err));

            //////////////// ADD TO USER MEETİNGD ////////

            for (email of myData.polls[high].attendees) {
                let arrM = [];
                arrM.push(newMeeting._id);

                arrM2 = { meeting: arrM };

                await User.findOne({ email: email }).then(myUser => {
                    if (!myUser) {
                        return res.status(404).end();
                    }

                    else {
                        var userMeeting = myUser.meeting;

                        // console.log(typeof(JSON.parse(userPoll)));

                        if (userMeeting == "") {
                            console.log("bos usermeeting")
                            console.log(arrM2);


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
                            console.log("dolu usermeeting");

                            async function updateDoluMeeting() {
                                var userMeeting2 = JSON.parse(userMeeting);
                                userMeeting2 = userMeeting2.meeting;

                                for (item of userMeeting2) {
                                    arrM2.meeting.push(item);
                                    arrM2.meeting = [...new Set(arrM2.meeting)];
                                }

                                console.log(arrM2);
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
                    console.log("Deleting from polls Successfull")
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
                        console.log("poll buldu");
                    }
                })
                .catch(err => next(err));
        }




        res.redirect("/profile/polls");

    }

    main();
};

module.exports.getmeetings = (req, res, next) => {

    console.log("Get Meetings")

    async function main() {
        console.log(req.user.meeting);
        meetingsArr = [];
        if (!req.user.meeting) {
            console.log("yeni user meeting");
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
                    console.log("Meeting found");
                    meetingsArr.push(Meeting);
                    //idArr.push(pollID);
                }

                else {
                    console.log("meeting not found")
                }
            }).catch(err => console.log(err));
        }

        console.log(meetingsArr);



        console.log("kokoretto");

        // for (item of meetingsArr) {
        //     item.meetings = JSON.parse(item.meetings);
        // }

        console.log(meetingsArr[0])

        console.log(typeof (meetingsArr[0]));

        res.render('meet', { data: { meetingsArr: JSON.stringify(meetingsArr) } });
    }

    main();

};