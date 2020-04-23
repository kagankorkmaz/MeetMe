var path = require("path");
const User = require("../models/User");
const Poll = require("../models/Poll");
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

var globBusyTimes = "";
var globMTitle = "";
var globMDesc = "koko";
var globMails = "";

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
                item = { "start_date": start, "end_date": end, "text": event.summary };
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
                var JSON_array = JSON.parse(userCalendars[k]);
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
                var JSON_array = JSON.parse(userCalendars[k]);
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
                            var updatedValues = {
                                poll: JSON.stringify(arr2)
                            }
                            User.updateOne({ email: myUser.email }, updatedValues).then(User => {
                                if (!User) { return res.status(404).end(); }
                            })
                                .catch(err => next(err));
                        }

                        else {
                            console.log("dolu userpoll");
                            var userPoll2 = JSON.parse(userPoll);
                            userPoll2 = userPoll2.poll;

                            for (item of userPoll2) {
                                arr2.poll.push(item);
                            }

                            console.log(arr2);
                            updatedValues2 = {
                                poll: JSON.stringify(arr2)
                            }
                            User.updateOne({ email: myUser.email }, updatedValues2).then(User => {
                                if (!User) { return res.status(404).end(); }
                            })
                                .catch(err => next(err));
                        }

                        res.redirect("/profile/calender");

                    }
                })
            }

            
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

module.exports.getAddCalender2 = (req, res) => {
    console.log("getaddcalener2");
    console.log(JSON.stringify(globMTitle));
    console.log(globMDesc);
    console.log("globMtitle");
    var title = globMTitle;
    var desc = globMDesc;
    var busyTimes = globBusyTimes;
    var mails = globMails;

    res.render("calendermeet2", { data: { title: req.body.myData.Mtitle, desc: req.body.myData.MDesc, busyTimes: busyTimes, mails: req.body.myData.mails } });
}
