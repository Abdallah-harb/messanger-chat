const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const AuthServices = require('../services/Auth/AuthServices');
const userSchema = new mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String,unique:true,lowercase:true,trim:true,required:true},
        email_verified_at:{type:Date,default:null},
        email_code_verified:{type:String,default:null},
        password:{type:String,required:true},
        phone:{type:String,default:null},
        phone_verified_at:{type:Date,default:null},
        avatar:{type:String,default:null}
    },
    {
        timestamps:true,versionKey:false
    }
);

//generate hash password
userSchema.statics.generateHash  = function (password) {
    return bcrypt.hash(password,10);
}

//checking if password is valid
userSchema.statics.validPassword = function (password){
    return bcrypt.compare(password,this.password);
}

// generate code verification
userSchema.methods.sentCodeVerification =async function (){
    const code = Math.floor(100000+Math.random()*900000);
    this.email_code_verified = await bcrypt.hash(code.toString(),10);
    await this.save();
    await AuthServices.sendMail({code:code,email:this.email});

}



// Automatically remove the password when converting to JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};


module.exports=mongoose.model('User',userSchema)
