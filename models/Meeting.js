const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    
    title:{
        type: String,
        default:''
    },

    description:{
        type: String,
        default:''
    },

    mails:{
        type: JSON,
        default:''
    },
    
    medium:{
        type: JSON,
        default:''
    },

    location:{
        type: JSON,
        default:''
    },

    link:{
        type: JSON,
        default:''
    },

    recurrance:{
        type: JSON,
        default:''
    },

    host:{
        type: JSON,
        default:''
    },

    start_date:{
        type: String,
        default:''
    },

    end_date:{
        type: String,
        default:''
    },

    vote:{
        type: String,
        default:''
    },
});

const Meeting = mongoose.model("meetings", meetingSchema);

module.exports = Meeting;