const AuthService = require('../../services/Auth/AuthServices');
const {userResource,userCollectionResource} = require('../../resource/UserResource');
const User = require('../../model/UserModel')
const LoggerServices = require("../../services/Logger/LoggerServices");
const Logger = new LoggerServices('log');
const {getRelativeUploadPath,deleteImageIfExists} = require('../../services/Files/HandelImageService')
const user = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        return jsonResponse(res,{'user' : userResource(user)});
    }catch (e) {
        return  errorResponse(res,e.message.e.errors)
    }

}

const changePassword = async (req,res)=>{
    try {
        const {current_password,password} = req.body;
        const user = await User.findById(req.user.id);

        const checkCurrentPassword = await user.validPassword(current_password);
        if(!checkCurrentPassword){
           return  errorResponse(res,'current-password incorrect .!');
        }

        if(current_password == password){
            return errorResponse(res,'new password and current password cannot be the same ')
        }
        user.password = await user.generateHash(password);
        await  user.save();
        return jsonResponse(res,[],'password-updated successfully');
    }catch (e) {

        return errorResponse(res,e.message,e.error)
    }

}

const updateProfile = async (req,res)=>{
    try {
        const {name,phone} = req.body;
        const user = await User.findById(req.user.id);
        if(req.file){
            if (user.avatar) {
                deleteImageIfExists(user.avatar);
            }
            user.avatar = getRelativeUploadPath(req.file.path);
        }
        user.name = name;
        user.phone = phone;
        await user.save();

        return jsonResponse(res,{"user":userResource(user)});
    }catch (e) {
        Logger.handleError('update-profile',e)
        return errorResponse(res,e.message,e.error,500);
    }

}

module.exports={user,changePassword,updateProfile}
