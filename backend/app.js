require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const recordRoutes = require('./routes/record');

app.use(express.json());
app.use(cors());

app.use('/main', userRoutes);
app.use('/predict', recordRoutes);

// 프론트 정적 파일 서빙
app.use(express.static(path.join(__dirname, './dist')));

app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("몽고디비 연결 성공!");
  app.listen(3000, '0.0.0.0');
  console.log("서버 연결 성공! (0.0.0.0:3000)");
}).catch(err => {
  console.log(err);
})