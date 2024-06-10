const express = require('express');
const { setIssueTrue } = require('../controller/getAlreadyIssuedMemberController');
const router = express.Router();


router  
    .route('/:memberId')
    .post(setIssueTrue)

const voterSlipIssueRouter = router;
module.exports = voterSlipIssueRouter;