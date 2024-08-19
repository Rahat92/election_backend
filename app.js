const express = require('express');
const cors = require('cors')
const pool = require('./utils/dbConnection');
const path = require('path')
const globalErrorController = require('./controller/globalErrorController');
const AppError = require('./utils/AppError');
const issuedMemberRouter = require('./router/issuedMemberRoutes');
const memberRouter = require('./router/memberRoutes');
const authRouter = require('./router/authRoutes');
const voterSlipIssueRouter = require('./router/voterSlipIssueRouter');
const projectRouter = require('./router/projectRoutes');
const reportRouter = require('./router/reportRoutes');
const app = express();

console.log('your ip', process.env.IP)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors())
app.use('/api/v1/all-issued-member',issuedMemberRouter);
app.use('/api/v1/project',projectRouter);
app.use('/api/v1/voter-slip',voterSlipIssueRouter);
app.use('/api/v1/all-members',memberRouter);
app.use('/api/v1/report',reportRouter);
app.use('/api/v1/auth',authRouter);
app.all('*', (req,res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})
app.use(globalErrorController)

module.exports = app;