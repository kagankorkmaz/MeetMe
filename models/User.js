const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({

    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pass:{
        type: String,
        required: true
    },

    about:{
        type: String
    },

    phone:{
        type: String
    }, 

    professsion:{
        type: String
    },

    totalMeetings:{
        type: Number,
        default: 0,
    },

    bio:{
        type: String
    }
});


const User = mongoose.model("User", userSchema);

module.exports = User;