const dayjs = require('dayjs');
const {userResource} = require('../resource/UserResource')
const User = require('../model/UserModel');
async function ConversationResource(conversation)
{
    const senderUser = await User.findById(conversation.sender_id);
    const receiverUser = await User.findById(conversation.receiver_id);
    return{
        id:conversation._id,
        sender:await userResource(senderUser)??null,
        receiver:await userResource(receiverUser)??null,
        last_message:conversation.last_message,
        created_at:dayjs(conversation.createdAt).format('YY-MM-DD'),
    }
}

function ConversationCollectionResource(conversations) {
    return Promise.all(conversations.map(conversation => ConversationResource(conversation)));
}

module.exports = { ConversationResource, ConversationCollectionResource };