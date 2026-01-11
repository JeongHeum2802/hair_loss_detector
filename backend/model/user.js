const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique: true
    } ,

    name : {
        type :String,
        required: true
    },

    gender : {
        type: Boolean,
        required : true
    },

    age : {
        type: Number,
        required : true
    },

    password : {
        type: String,
        required : true
    },
    
    refreshToken: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema);