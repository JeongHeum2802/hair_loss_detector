require('dotenv').config();

const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const http = require('http');

const userRoutes = require('./routes/user');
const recordRoutes = require('./routes/record');

app.use(express.json());

app.use('/main', userRoutes);
app.use('/predict', recordRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("몽고디비 연결 성공!");
    app.listen(3000);
    console.log("서버 연결 성공!");
}).catch(err => {
    console.log(err);
})