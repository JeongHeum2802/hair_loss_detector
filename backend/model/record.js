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
    },

    comment: {
        type: String
    }
    
}, {timestamps: true})

module.exports = mongoose.model('Record', recordSchema);
