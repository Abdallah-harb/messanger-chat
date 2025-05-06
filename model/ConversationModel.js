const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const conversationSchema = new mongoose.Schema(
    {
        sender_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        receiver_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        last_message:{type:String}
    },{
        timestamps:true,versionKey:false,
    }
);
conversationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Conversation',conversationSchema);