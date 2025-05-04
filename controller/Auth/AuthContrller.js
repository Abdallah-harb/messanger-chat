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
        return  errorResponse(res,e.message,e.error)
    }
}

const verifyCode = async (req,res)=>{
    try{
        const {email,code} = req.body;
        const user = await User.findOne({email:email});
        if(user.email_verified_at != null){
            return res.status().json({
                status: 400,
                message: "email already be verified",
            });
        }
        const checkCode = await bcrypt.compare(String(code),user.email_code_verified);
        if(!checkCode){
            return res.status(400).json({
                status:400,
                message:"code is invalid , please enter correct code "
            })
        }
        user.email_verified_at = new Date();
        await user.save();
        const token = jwt.sign({ email: user.email ,id:user._id}, process.env.SECRET_TOKEN,{expiresIn:'1d'});
        return res.status(200).json({
            status:200,
            message: "email verified correctly",
            token:token
        });

    }catch (e) {
        Logger.handleError('register', e);
        return res.status(500).json({
            status:500,
            message: e.message
        });
    }

}

const resendCode = async (req,res)=>{
    try{
        const {email} = req.body;
        const user  = await User.findOne({email:email});
        if(user.email_verified_at != null){
            return res.status(200).json({
                status: 200,
                message: "email already be verified",
            });
        }
        let sent = false
        try {
            await user.sentCodeVerification()
            sent = true;
        } catch (e) {
            sent = false;
            Logger.handleError('register-sent-code', e);
        }
        return res.status(200).json({
            status: 200,
            message: "check your email ",
            sent:sent
        });
    }catch (e) {
        Logger.handleError('register-sent-code', e);
        return res.status(500).json({
            status: 500,
            message: e.message,
        });

    }

}


const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(401).json({
                status: 401,
                message: "credential not match ",
            });
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).json({
                status: 401,
                message: "credential not match ",
            });
        }

        const token = jwt.sign({ email: user.email ,id:user._id }, process.env.SECRET_TOKEN,{expiresIn:'1d'});
        return res.status(200).json({
            status: 200,
            message: "success",
            token:token
        });
    }catch (e) {
        Logger.handleError('login', e);
        return res.status(500).json({
            status: 500,
            message: e.message,
        });
    }

}

const logout = (req,res)=>{

}

module.exports={register,verifyCode,resendCode,login,logout}

