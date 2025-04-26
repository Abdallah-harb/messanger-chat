const mongoose = require('mongoose');
const messageModel = new mongoose.Schema(
    {
        conversation_id:{type:mongoose.Schema.Types.ObjectId,ref:"Conversation",required:true},
        sender_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        receiver_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        message:{type:String,required:true},
        seen:{type:Boolean,default:false}

    },
    {
        timestamps:true,versionKey:false
    }
);

module.exports = mongoose.model('Message',messageModel);


