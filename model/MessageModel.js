const mongoose = require('mongoose');
const {MessageTypesEnum} = require('../Enum/MessageTypesEnum');
const mongoosePaginate = require("mongoose-paginate-v2");
const messageModel = new mongoose.Schema(
    {
        conversation_id:{type:mongoose.Schema.Types.ObjectId,ref:"Conversation",required:true},
        sender_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        receiver_id:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        message:{type:String,
                    required: function () {
                        return this.message_type === MessageTypesEnum.TEXT;
                    }},
        file:{type: String,default:null},
        message_type:{type:String,default:MessageTypesEnum.TEXT},
        seen:{type:Boolean,default:false}

    },
    {
        timestamps:true,versionKey:false
    }
);
messageModel.plugin(mongoosePaginate);

module.exports = mongoose.model('Message',messageModel);


