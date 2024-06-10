const express = require('express');
const { generateCounterReport } = require('../controller/reportController');
const router = express.Router();


router  
    .route('/')
    .get(generateCounterReport)

const reportRouter = router;
module.exports = reportRouter;