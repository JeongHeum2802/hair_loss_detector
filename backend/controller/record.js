require('dotenv').config();

const Record = require('../model/record');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

//cloudinary에 사진 저장
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

//이마 사진 cloudinary에 저장 후 url DB에 저장
exports.saveForeheadPicture = async (req, res, next) => {
    try{
    const file = req.file;
    const {userId} = req.body;

    if(!file){
        return res.status(400).json({message: "파일 없음"});
    }

    const result = await uploadToCloudinary(file.buffer, 'hair/forehead');
    const secure_url = result.secure_url;
    const public_id = result.public_id;

    const record = await Record.create({
        userId,
        foreheadPic : {imageUrl : secure_url, publicId : public_id}
    });

    console.log(record);
    console.log(secure_url);
    console.log(public_id);

    res.json({
        imageUrl: secure_url,
        publicId: public_id,
        record: record
    });
} catch(err) {
    console.log(err);
    res.status(500).json({message: "업로드 실패"});
}
}

//정수리 사진 cloudinary에 저장 후 DB에 저장
exports.saveCrownPicture = async (req, res, next) => {
    try{
    const file = req.file;
    const {recordId} = req.body;

    if(!file){
        return res.status(400).json({message: "파일 없음"});
    }

    const result = await uploadToCloudinary(file.buffer, 'hair/crown');
    const secure_url = result.secure_url;
    const public_id = result.public_id;

    const record = await Record.findByIdAndUpdate(
        recordId,
        {crownPic: {imageUrl: secure_url, publicId : public_id} }, 
        { new: true}
    );

    console.log(record);
    console.log(secure_url);
    console.log(public_id);

    res.json({
        imageUrl: secure_url,
        publicId: public_id,
        record: record
    });
} catch(err) {
    console.log(err);
    res.status(500).json({message: "업로드 실패"});
}
}

//프론트에서 userId를 받아서 해당 user의 모든 레코드 조회
exports.sendRecord = async (req,res,next) => {
    try{
    const userId = req.user.userId;

    const records = await Record.find({userId});

    res.status(200).send(records);

    } catch(err) {
        console.log(err);
        res.status(500).json({messsage: "레코드 조회 실패!"});
    }
}

//프론트에서 레코드 ID를 받아 삭제
exports.deleteRecord = async (req, res, next) => {
    try{
        const {recordId} = req.body;

        await Record.findByIdAndDelete({_id : recordId});

        console.log("삭제 성공!");
        res.status(200).json({message: "삭제 성공"});
    } catch(err){
        console.log(err);
        res.status(500).json({message: "삭제 실패!"});
    }
}
