require('dotenv').config();

const Record = require('../model/record');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const { listenerCount } = require('../model/emailAuth');

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

//cloudinary에 저장된 사진 삭제
const deleteFromCloudinary = async (publicId) => {
    if(!publicId)
        return;

    return await cloudinary.uploader.destroy(publicId);
};

//프론트에서 보낸 레코드 저장
exports.saveRecord = async (req, res, next) => {
    try{
        const userId = req.user.userId;
        const foreheadPic = req.files?.foreheadPic?.[0];
        const crownPic = req.files?.crownPic?.[0];

        if(!foreheadPic || !crownPic)
            return res.status(400).json({message: "사진 두 장 필요!"});

        const {probability, comment} = req.body;

        // Cloudinary 업로드
        const foreheadResult = await uploadToCloudinary(
            foreheadFile.buffer,
            'hair/forehead'
        );

        const crownResult = await uploadToCloudinary(
            crownFile.buffer,
            'hair/crown'
        );

        // DB 저장
        const record = await Record.create({
            userId,
            foreheadPic: {
                imageUrl: foreheadResult.secure_url,
                publicId: foreheadResult.public_id
            },
            crownPic: {
                imageUrl: crownResult.secure_url,
                publicId: crownResult.public_id
            },
            probability: probability,
            comment: comment
        });

        res.status(201).json({
            message: '업로드 성공',
            record
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '업로드 실패' });
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
        const userId = req.user.userId;

        const record = await Record.findOne({ _id: recordId, userId});

        if(!record)
            return res.status(404).json({message: "Record 없음"});

    
        await Promise.all([
            record.foreheadPic?.publicId &&
                deleteFromCloudinary(record.foreheadPic.publicId),
            record.crownPic?.publicId &&
                deleteFromCloudinary(record.crownPic.publicId),
        ]);

        await Record.findByIdAndDelete(recordId);

        console.log("삭제 성공!");
        res.status(200).json({message: "삭제 성공"});
    } catch(err){
        console.log(err);
        res.status(500).json({message: "삭제 실패!"});
    }
}
