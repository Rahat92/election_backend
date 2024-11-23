const express = require('express');
const { getAllMembers, resetMember, updateMember } = require('../controller/getAlreadyIssuedMemberController');
const router = express.Router();
const {uploadSingle, resizeUploadedImage} = require('./../utils/fileUpload')

router  
    .route('/')
    .post(getAllMembers)
router  
    .route('/:id')
    .post(uploadSingle, resizeUploadedImage, updateMember)
router  
    .route('/resetMember')
    .post(uploadSingle, resizeUploadedImage, resetMember)


const memberRouter = router;
module.exports = memberRouter;