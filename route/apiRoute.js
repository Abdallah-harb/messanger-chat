const express = require('express')
const Route = express.Router();
const {upload} = require('../services/Files/HandelImageService');
const AuthController = require('../controller/Auth/AuthContrller');
const {RegisterValidate} = require('../validator/Auth/RegisterValidate');
const {handelErrorValidate} = require('../Helpier/errorValidate');
const {ResendCodeValidate} = require('../validator/Auth/ResendCodeValidate');
const {VerifyCodeValidate} = require('../validator/Auth/VerifyCodeValidate');
const {checkAuth} = require('../middleware/CheckAuthMiddleware');
const UserController = require('../controller/Auth/UserController');
const {LoginValidate} = require('../validator/Auth/LoginValidate')
const {ChangePasswordValidate} = require('../validator/Profile/ChangePasswordValidate');
const {UpdateProfileValidate} = require('../validator/Profile/UpdateProfileValidate');

Route.post('/register',RegisterValidate(),handelErrorValidate,AuthController.register);
Route.post('/verify-code',VerifyCodeValidate(),handelErrorValidate,AuthController.verifyCode);
Route.post('/resend-code',ResendCodeValidate(),handelErrorValidate,AuthController.resendCode);
Route.post('/login',LoginValidate(),handelErrorValidate,AuthController.login);

//auth route
Route.get('/user',checkAuth,UserController.user)
Route.put('/change-password',checkAuth,ChangePasswordValidate(),handelErrorValidate,UserController.changePassword)
Route.post('/update-profile',checkAuth,upload.single('avatar'),
                                  UpdateProfileValidate(),
                                    handelErrorValidate
                                ,UserController.updateProfile);

module.exports = Route;