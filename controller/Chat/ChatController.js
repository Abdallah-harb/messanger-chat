const Conversation = require('../../model/ConversationModel')
const Message = require('../../model/MessageModel')
const User = require('../../model/UserModel')
const LoggerServices = require("../../services/Logger/LoggerServices");
const Logger = new LoggerServices('log');
const {ConversationResource, ConversationCollectionResource } = require('../../resource/ConversationResource');
const {MessageResource, messagesCollectionResource } = require('../../resource/MessageResource');
const { getRelativeUploadPath} = require("../../services/Files/HandelImageService");
const {MessageTypesEnum} = require('../../Enum/MessageTypesEnum');
const conversations = async (req,res)=>{
    try {
        //paginate
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: { createdAt: -1 }
        };
        const conversations = await Conversation.paginate({
                                            $or:[
                                                { sender_id: req.user.id},
                                                { receiver_id: req.user.id }
                                            ]
                                        },options);
        return paginateResponse(res,
            {'conversations':await ConversationCollectionResource(conversations.docs)},conversations);
    }catch (e) {
        Logger.handleError('conversations',e);
        return errorResponse(res,e.message);
    }

}

const startConversation = async (req,res)=>{
    try{
        const { receiver_id,message,message_type } = req.body;

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
        const newMessage = new Message();
        newMessage.conversation_id= conversation._id;
        newMessage.sender_id= authUser._id;
        newMessage.receiver_id= receiver_id;
        newMessage.message= message;
        newMessage.message_type=message_type;

        if(req.file && message_type === MessageTypesEnum.IMAGE){
            newMessage.avatar = getRelativeUploadPath(req.file.path);
        }
        await newMessage.save();

        const messageData = await MessageResource(newMessage);
        const conversationData = await ConversationResource(conversation);

        const io = req.app.get('io');
        io.to(receiver_id.toString()).emit('chat-message', {
            conversation: conversationData,
            message:messageData,
        });
        return jsonResponse(res,
                    {
                        "conversation": conversationData,
                        "message":messageData
                    });
    }catch (e) {
        Logger.handleError('start-conversation',e)
        return errorResponse(res,e.message);
    }

}

const sendMessage = async (req,res)=>{
    try{
       const {conversation_id,receiver_id,message,message_type} = req.body;
        const conversation = await Conversation.findById(conversation_id);
        if (!conversation) {
            return errorResponse(res, "Conversation not found.");
        }
        const new_message = new Message();
        new_message.conversation_id = conversation_id;
        new_message.sender_id = req.user.id;
        new_message.receiver_id = receiver_id;
        new_message.message = message;
        if(message_type){
            new_message.message_type = message_type;
        }
        await new_message.save();

        conversation.last_message = message;
        await conversation.save();

        // fire event
        const messageData = await MessageResource(new_message)
        const io = req.app.get('io');
        io.to(receiver_id.toString()).emit('chat-message', {
            message:messageData,
        });

        return jsonResponse(res,{'message':messageData});
    }catch (e) {
        Logger.handleError('send-message',e)
        return errorResponse(res,e.message)
    }
}

const messages = async (req,res)=>{
    try {
        //paginate
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: { createdAt: -1 }
        };
        const conversation = await Conversation.findById(req.params.conversation_id);
        if(!conversation){
            return errorResponse(res,'resource not found',[],404);
        }
        const messages = await Message.paginate({ conversation_id: conversation._id }, options);

        return paginateResponse(res,{"messages": await messagesCollectionResource(messages.docs)},messages);
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

    return jsonResponse(res,{'message':await MessageResource(message)});
}

module.exports = {conversations,startConversation,sendMessage,messages,messageSeen}

