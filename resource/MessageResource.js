const dayjs = require('dayjs');
const {userResource} = require('../resource/UserResource')
const User = require('../model/UserModel');
async function MessageResource(message)
{
    const senderUser = await User.findById(message.sender_id);
    const receiverUser = await User.findById(message.receiver_id);
    const filePath = message.file ? `${process.env.APP_URL}/${message.file}` : null;
    return{
        id:message._id,
        sender:await userResource(senderUser)??null,
        receiver:await userResource(receiverUser)??null,
        message:message.message,
        file:filePath,
        message_type:message.message_type,
        seen:message.seen,
        created_at:dayjs(message.createdAt).format('YY-MM-DD'),
    }
}

async function messagesCollectionResource(messages) {
    return Promise.all(messages.map(message => MessageResource(message)));
}

module.exports = { MessageResource, messagesCollectionResource };