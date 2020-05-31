const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pollSchema = new Schema({
    
    voterCount:{
        type: Number,
        default: ''
    },

    voters:{
        type: Number,
        default:''
    },

    created:{
        type: String,
        default:''
    },

    polls:{
        type: JSON,
        default:''
    }
});

const Poll = mongoose.model("polls", pollSchema);

module.exports = Poll;