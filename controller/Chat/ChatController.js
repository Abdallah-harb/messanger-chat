const Conversation = require('../../model/ConversationModel')
const Message = require('../../model/MessageModel')
const User = require('../../model/UserModel')
const {error} = require("winston");
const LoggerServices = require("../../services/Logger/LoggerServices");
const Logger = new LoggerServices('log');
const {ConversationResource, ConversationCollectionResource } = require('../../resource/ConversationResource');
const {MessageResource, messagesCollectionResource } = require('../../resource/MessageResource');
const conversations = (req,res)=>{

}

const startConversation = async (req,res)=>{
    try{
        const { receiver_id,message } = req.body;
        const authUser = await User.findById(req.user.id);


        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            $or: [
                { sender_id: authUser._id, receiver_id: receiver_id },
                { sender_id: receiver_id, receiver_id: authUser._id }
            ]
        });

        if (!conversation) {
            conversation = await Conversation.create({
                sender_id: authUser._id,
                receiver_id: receiver_id,
                last_message: message
            });
        } else {
            conversation.last_message = message;
            await conversation.save();
        }

        // Create new message
        const newMessage = await Message.create({
            conversation_id: conversation._id,
            sender_id: authUser._id,
            receiver_id: receiver_id,
            message: message
        });
        return jsonResponse(res,{conversation:ConversationResource(conversation),message:MessageResource(newMessage)});
    }catch (e) {
        Logger.handleError('start-conversation',e)
        return errorResponse(res,e.message);
    }

}

const sendMessage = (req,res)=>{

}

const messages = (req,res)=>{

}

module.exports = {conversations,startConversation,sendMessage,messages}

