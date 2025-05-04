const dayjs = require('dayjs');
const {userResource} = require('../resource/UserResource')
const User = require('../model/UserModel');
async function ConversationResource(conversation)
{
    return{
        id:conversation._id,
        sender:userResource(await User.findById(conversation.sender_id)),
        receiver:userResource(await User.findById(conversation.receiver_id)),
        last_message:conversation.last_message,
        created_at:dayjs(user.createdAt).format('YY-MM-DD'),
    }
}

function ConversationCollectionResource(conversations) {
    return conversations.map(conversation => ConversationResource(conversation));
}

module.exports = { ConversationResource, ConversationCollectionResource };