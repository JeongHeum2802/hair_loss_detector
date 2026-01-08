const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
