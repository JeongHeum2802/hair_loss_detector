const mongoose = reuqire('mongoose');

const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    pictureUrl : {
        type: String,
        required : true
    },

    email: {
        type: String, 
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.module('Picture', pictureSchema);