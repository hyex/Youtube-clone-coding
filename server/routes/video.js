const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

//=================================
//             Video
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mov') {
            return cb(res.status(400).end('only jpg, png, mov is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.get('/getVideos', (req, res) => {

    // DB에서 비디오를 가져와서 클라에게 보낸다s
    
    Video.find()
        .populate('writer') // 아걸 해줘야 모든 writer 정보를 가져올 수 있는것. ? 
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success: true, videos})
        })

    
})

router.post('/thumbnail', (req, res) => {

    // 썸네일 생성 & 러닝 타임 가져오기

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration})
    })
    .on('error', function (err) {
        console.error(err);
        return res.json({ success: false, err });
    })
    .screenshots({
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        // -%b : extension은 빼고
        filename: 'thumbnail-%b.png'
    })



})

router.post('/uploadVideo', (req, res) => {

    // 비디오를 DB에 저장

    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) {
            return res.json({ success: false, err})
        }
        res.status(200).json({ success: true})
    })
})

router.post("/getVideoDetail", (req, res) => {

    Video.findOne({ "_id" : req.body.videoId })
    .populate('writer')
    .exec((err, video) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, video })
    })
});


module.exports = router;