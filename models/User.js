const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    pass: {
        type: String,
        default: ''
    },

    about: {
        type: String,
        default: ''
    },

    phone: {
        type: String,
        default: ''
    },

    professsion: {
        type: String,
        default: ''
    },

    totalMeetings: {
        type: Number,
        default: 0,
    },

    bio: {
        type: String,
        default: ''
    },

    googleId: {
        type: String,
        default: ''

    }
});


const User = mongoose.model("User", userSchema);

module.exports = User;