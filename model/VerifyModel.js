const mongoose = require('mongoose');
const verifySchema = new mongoose.Schema(
    {
        email:{type:String,required:true},
        code:{type:String,required:true},
    },
    {
        timestamps:true,versionKey:false
    }
);

module.exports= mongoose.model('Verify',verifySchema);