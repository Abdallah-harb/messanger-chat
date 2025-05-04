const mongoose = require('mongoose');
const {MessageTypesEnum} = require('../Enum/MessageTypesEnum');

const messageModel = new mongoose.Schema(
    {
        conversation_id:{type:mongoose.Schema.Types.ObjectId,ref:"Conversation",required:true},
        sender_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        receiver_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        message:{type:String,required:true},
        message_type:{type:String,default:MessageTypesEnum.TEXT},
        seen:{type:Boolean,default:false}

    },
    {
        timestamps:true,versionKey:false
    }
);

module.exports = mongoose.model('Message',messageModel);


