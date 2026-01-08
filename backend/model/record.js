const mongoose = reuqire('mongoose');

const Schema = mongoose.Schema;

<<<<<<< Updated upstream:backend/model/picture.js
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
=======
const recordSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },

    foreheadPic : {
        imageUrl: {
            type: String,
        },

        publicId: {
            type: String,
        }
    },

    crownPic : {
        imageUrl: {
            type: String,
        },

        publicId: {
            type: String,
        }
    },

    probability: {
        type: Number
    }
}, {timestamps: true})

module.exports = mongoose.model('Picture', recordSchema);
>>>>>>> Stashed changes:backend/model/record.js
