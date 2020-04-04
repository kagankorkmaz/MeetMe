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

    phone: {
        type: String,
        default: ''
    },

    profession: {
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
    },

    jobDescription: {
        type: String,
        default: ''
    },

    name: {
        type: String,
        default: ''
    },

    surname: {
        type: String,
        default: ''
    },

    linkedin: {
        type: String,
        default: ''
    },

    twitter: {
        type: String,
        default: ''
    },

    instagram: {
        type: String,
        default: ''
    },
 
    website: {
        type: String,
        default: ''
    }

});


const User = mongoose.model("User", userSchema);

module.exports = User;