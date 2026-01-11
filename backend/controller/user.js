require('dotenv').config();

const User = require('../model/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EmailAuth = require('../model/emailAuth');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


//회원가입
exports.signUp = async (req, res, next) => {
    try {
        const { email, name, gender, age, password } = req.body;

        // 이메일 인증 완료 여부 확인
        const auth = await EmailAuth.findOne({ email });
        if (auth) {
            return res.send({
                state: 'fail',
                message: '이메일 인증을 먼저 완료하세요.'
            });
        }

        const newPassword = await bcrypt.hash(password, 12);

        user = await User.create({ email, name, gender, age, password: newPassword });
        console.log(user);
        console.log("회원가입 성공!");
        return res.send({
            message: "회원가입 성공!"
        });
    } catch (err) {
        console.log(err);
        console.log("회원가입 실패!");
    }

    const newPassword = await bcrypt.hash(password, 12);

    user = await User.create({ email, name, gender, age, password: newPassword });
    console.log(user);
    console.log("회원가입 성공!");
    return res.send({
      message: "회원가입 성공!"
    });
  } catch (err) {
    console.log(err);
    console.log("회원가입 실패!");
    res.send({
      state: "fail",
      message: "회원가입 실패!"
    });
  }
}

//로그인
exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ 'email': email });

  if (!user) {
    return res.send({
      state: "fail",
      message: "회원이 존재하지 않습니다."
    });
  }
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    console.log("로그인 실패!");
    return res.send({
      state: "fail",
      message: "로그인 실패!"
    });
  }

  //Access Token 발급
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: '1h' }
  );

  //Refresh Token 발급
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: '7d' }
  );

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.send({
    state: 'success',
    message: '로그인 성공!',
    accessToken
  });
}

//로그아웃
exports.logOut = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  await User.findOne(
    { refreshToken },
    { $unset: { refreshToken: 1 } }
  );

  res.clearCookie('refreshToken');
  res.send({ message: '로그아웃' })
};

//6자리 난수 생성 함수
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

//이메일 인증 발송 API (데이터베이스에 코드 저장)
exports.sendEmailCode = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.send({
      state: "fail",
      message: "이미 가입된 메일입니다."
    });
  }

  const code = generateCode();

  await EmailAuth.findOneAndUpdate({ email }, {
    code,
    expiresAt: Date.now() + 1000 * 60 * 5  //5분
  },
    { upsert: true });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: email,
    subject: '회원가입 인증 코드',
    html: `<h3>인증 코드: <b>${code}</b></h3>`
  });

  res.send({
    state: 'success',
    message: '인증 코드가 이메일로 전송되었습니다.'
  });
}

//사용자가 입력한 코드와 데이터베이스에 저장된 코드 비교하는 API
exports.verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  const auth = await EmailAuth.findOne({ email });

  if (!auth) {
    return res.send({
      state: 'fail',
      message: '인증 요청이 없습니다.'
    });
  }

  if (auth.expiresAt < Date.now()) {
    await EmailAuth.deleteOne({ email });
    return res.send({
      state: 'fail',
      message: '인증 코드가 만료되었습니다.'
    });
  }

  if (auth.code !== code) {
    return res.send({
      state: 'fail',
      message: '인증 코드가 일치하지 않습니다.'
    });
  }

  //인증 성공시 임시 데이터 삭제
  await EmailAuth.deleteOne({ email });

  res.send({
    state: 'success',
    message: '이메일 인증 성공'
  });
};

//RefreshToken으로 AccessToken 재발급
exports.refresh = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.sendStatus(401);

  const user = await User.findOne({ refreshToken });
  if (!user)
    return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY,
    async (err, decoded) => {
      if (err)
        return res.sendStatus(403);

      //재발급
      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: '1h' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
      );

      user.refreshToken = newRefreshToekn;
      await user.save();

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: ture,
        secure: false,
        sameSite: 'strict'
      });

      res.send({ accessToken: newAccessToken });
    }
  )
}