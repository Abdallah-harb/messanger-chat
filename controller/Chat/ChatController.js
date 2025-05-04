const Conversation = require('../../model/ConversationModel')
const Message = require('../../model/MessageModel')
const User = require('../../model/UserModel')
const {error} = require("winston");
const LoggerServices = require("../../services/Logger/LoggerServices");
const Logger = new LoggerServices('log');
const {ConversationResource, ConversationCollectionResource } = require('../../resource/ConversationResource');
const {MessageResource, messagesCollectionResource } = require('../../resource/MessageResource');
const conversations = async (req,res)=>{
    try {
        const conversations = await Conversation.find({
            $or:[
                { sender_id: authUser._id},
                { receiver_id: authUser._id }
            ]
        })
        return jsonResponse(res,
            {'conversations':ConversationCollectionResource(conversations)}
                );
    }catch (e) {
        Logger.handleError('conversations',e);
        return errorResponse(res,e.message);
    }

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
        return jsonResponse(res,
                    {
                        conversation:ConversationResource(conversation),
                        message:MessageResource(newMessage)
                    });
    }catch (e) {
        Logger.handleError('start-conversation',e)
        return errorResponse(res,e.message);
    }

}

const sendMessage = async (req,res)=>{
    try{
       const {conversation_id,receiver_id,message,message_type} = req.body;
        const new_message = new Message();
        new_message.conversation_id = conversation_id;
        new_message.sender_id = req.user.id;
        new_message.receiver_id = receiver_id;
        new_message.message = message;
        if(message_type){
            new_message.message_type = message_type;
        }
        await new_message.save();

        return jsonResponse(res,{'message':MessageResource(new_message)});
    }catch (e) {
        Logger.handleError('send-message',e)
        return errorResponse(res,e.message)
    }
}

const messages = async (req,res)=>{
    try {
        const conversation = await Conversation.findById(req.params.conversation_id);
        if(!conversation){
            return errorResponse(res,'resource not found',[],404);
        }
        const messages = await Message.find({conversation_id: conversation._id});

        return jsonResponse(res,{"messages":messages});
    }catch (e) {
        Logger.handleError('messages',e)
        return errorResponse(res,e.message);

    }
}

const messageSeen = async (req,res)=>{
    const message = await Message.findById(req.params.id);
    if(!message){
        return errorResponse(res,'resource not found',[],404);
    }
    message.seen=true;
    await message.save();
    return jsonResponse(res,{'message':MessageResource(message)});
}


module.exports = {conversations,startConversation,sendMessage,messages,messageSeen}

