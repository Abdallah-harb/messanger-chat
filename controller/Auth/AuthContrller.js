const User = require('../../model/UserModel');
const LoggerServices = require('../../services/Logger/LoggerServices');
const bcrypt = require("bcryptjs");
const Logger = new LoggerServices('register');
const jwt = require('jsonwebtoken');
const register = async (req,res)=> {
    try {
        const {name, email, password} = req.body;
        const user = await User.create({name: name, email: email, password: await User.generateHash(password)});

        let sent = false
        try {
            await user.sentCodeVerification()
            sent = true;
        } catch (e) {
            sent = false;
            Logger.handleError('register-sent-code', e);
        }
        return jsonResponse(res,{"sent":sent})

    } catch (e) {
        Logger.handleError('register', e);
        return  errorResponse(res,e.message,e.error,500)
    }
}

const verifyCode = async (req,res)=>{
    try{
        const {email,code} = req.body;
        const user = await User.findOne({email:email});
        if(user.email_verified_at != null){
           return  errorResponse(res,"email already be verified");
        }
        const checkCode = await bcrypt.compare(String(code),user.email_code_verified);
        if(!checkCode){
           return  errorResponse(res,"code is invalid , please enter correct code ");
        }
        user.email_verified_at = new Date();
        await user.save();
        const token = jwt.sign({ email: user.email ,id:user._id}, process.env.SECRET_TOKEN,{expiresIn:'1d'});
        return jsonResponse(res,{'token':token});

    }catch (e) {
        Logger.handleError('register', e);
        return errorResponse(res,e.message,e.errors,500)
    }

}

const resendCode = async (req,res)=>{
    try{
        const {email} = req.body;
        const user  = await User.findOne({email:email});
        if(user.email_verified_at != null){
            return errorResponse(res,"email already be verified",)
        }
        let sent = false
        try {
            await user.sentCodeVerification()
            sent = true;
        } catch (e) {
            sent = false;
            Logger.handleError('register-sent-code', e);
        }
        return jsonResponse(res,{"sent":sent});
    }catch (e) {
        Logger.handleError('register-sent-code', e);
        return errorResponse(res,e.message,e.errors,500);
    }

}


const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return errorResponse(res,"credential not match ",null,401)
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return errorResponse(res,"credential not match ",null,401)
        }

        const token = jwt.sign({ email: user.email ,id:user._id }, process.env.SECRET_TOKEN,{expiresIn:'1d'});
        return jsonResponse(res,{"token":token});
    }catch (e) {
        Logger.handleError('login', e);
        return errorResponse(res,e.message,e.errors,500)
    }

}

const logout = (req,res)=>{

}

module.exports={register,verifyCode,resendCode,login,logout}

