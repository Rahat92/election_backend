const jwt = require("jsonwebtoken");
const catchAsyncError = require("../utils/catchAsyncError");
const pool = require("../utils/dbConnection");

const tokenProducer = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY || 'amarsonarbangla', {
    expiresIn: process.env.EXPIRE_TOKEN || '10d',
  });
};

const resAndSendToken = (user, res, statusCode) => {
  const token = tokenProducer(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token", token, cookieOptions);
  if (process.env.NODE_ENV === "PRODUCTION") cookieOptions.secure = true;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return next(
      //   new AppError(`You are not allowed to perform this action`, 400)
      // );
      return res.status(401).json({
        status: "fail",
        message: "You are not allowed to perform this action",
      });
    }
    next();
  };
};

exports.login = catchAsyncError(async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({
      status: "Fail",
      message: "Email or password is missing",
    });
  }
  const user = (await pool.request().input('tx_action_name', 'USER_LOGIN').input('tx_name', name).execute('SEL_user')).recordset[0];
  if(!user || user.tx_password!==password){
    return res.status(404).json({
        status:'Fail',
        message: 'Invalid User Or Password.'
    })
  }
  resAndSendToken(user, res, 200);
});

const protected = catchAsyncError(async(req,res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }else if(req.cookies.jwt){
    token = req.cookies.jwt
  }

  if(!token){
    return res.status(401).json({
      status:'Fail',
      message: 'You are not logged in, please log in to get access.'
    })
  }
})

exports.protect = catchAsyncError(async (req, res, next) => {});
