const express = require('express')
const Route = express.Router();
const AuthController = require('../controller/Auth/AuthContrller');
const {RegisterValidate} = require('../validator/Auth/RegisterValidate');
const {handelErrorValidate} = require('../Helpier/errorValidate');

Route.post('/register',RegisterValidate,handelErrorValidate,AuthController.register);
Route.post('/verify-code',AuthController.verifyCode);
Route.post('/resend-code',AuthController.resendCode);
Route.post('/login',AuthController.login);



module.exports = Route;