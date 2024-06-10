const AppError = require("../utils/AppError");

module.exports = (err, req,res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err)
}