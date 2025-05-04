const dayjs = require('dayjs');
const {userResource} = require('../resource/UserResource')
const User = require('../model/UserModel');
async function MessageResource(message)
{
    return{
        id:message._id,
        sender:userResource(await User.findById(message.sender_id)),
        receiver:userResource(await User.findById(message.receiver_id)),
        message:message.message,
        message_type:message.message_type,
        seen:message.seen,
        created_at:dayjs(user.createdAt).format('YY-MM-DD'),
    }
}

function messagesCollectionResource(messages) {
    return messages.map(message => MessageResource(message));
}

module.exports = { MessageResource, messagesCollectionResource };