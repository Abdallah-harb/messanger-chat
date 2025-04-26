const User = require('../../model/UserModel');
const AuthService = require('../../services/Auth/AuthServices')
const register = async (req,res)=>{
    const {name,email,password} = req.body;
    const user = await User.create({name:name,email:email,password: await User.generateHash(password)});
    let sent = false
    try {
        await user.sentCodeVerification()
        sent = true;
    }catch (e) {
        sent=false;
    }
    return res.status(200).json({
        status: 200,
        message: " Registered Successfully .!",
        sent:sent
    })
}

const verifyCode = async (req,res)=>{

}

const resendCode = async (req,res)=>{

}


const login = async (req,res)=>{

}

module.exports={register,verifyCode,resendCode,login}

