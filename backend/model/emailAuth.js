const mongoose = require('mongoose');

const schema = mongoose.Schema;

//이메일 인증을 위한 임시 코드 저장 스키마
const emailAuthSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    code : {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('EmailAuth', emailAuthSchema);