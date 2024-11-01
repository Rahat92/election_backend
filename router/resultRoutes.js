const express = require('express');
const { getResult } = require('../controller/resultController');
const router = express.Router();


router  
    .route('/')
    .get( getResult)

const reportRouter = router;
module.exports = reportRouter;