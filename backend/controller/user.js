require('dotenv').config();

const User = require('../model/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//회원가입
exports.signIn = async (req, res, next) => {
    try{
        const {email , name, gender, age, password} = req.body;

        let user = null;
        user = await User.findOne({'email' : email});
        if(user != null){
            return res.send({
                state: "fail",
                message: "이미 존재하는 회원입니다."
            });
        }

        const newPassword = await bcrypt.hash(password, 12);

        user = await User.create({email, name, gender, age, password : newPassword});
        console.log(user);
        console.log("회원가입 성공!");
        return res.send({
            message: "회원가입 성공!"
        });
    } catch(err) {
        console.log(err);
        console.log("회원가입 실패!");
    }
}

//로그인
exports.logIn = async (req, res, next) => {
    const {email, password} = req.body;

    const user = await User.findOne({'email' : email});

    if(!user){
        return res.send({
            state : "fail",
            message: "회원이 존재하지 않습니다."
        });
    }
    const result = await bcrypt.compare(password, user.password);

    if(result == true){
        console.log("로그인 성공!");
        return res.send({
            state : "success",
            message : "로그인 성공!"
        });
    }

    else{
        console.log("로그인 실패!");
        return res.send({
            state: "fail",
            message: "로그인 실패!"
        });
    }
}