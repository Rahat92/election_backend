const express = require('express');
const { getAllMembers, resetMember } = require('../controller/getAlreadyIssuedMemberController');
const uploadSingle = require('../utils/fileUpload');
const router = express.Router();


router  
    .route('/')
    .post(getAllMembers)
router  
    .route('/resetMember')
    .post(uploadSingle, resetMember)

const memberRouter = router;
module.exports = memberRouter;