const dayjs = require('dayjs');
 function userResource(user)
{
    return{
        id:user._id,
        name:user.name,
        email:user.email,
        email_verified_at:user.email_verified_at,
        phone:user.phone,
        phone_verified_at:user.phone_verified_at,
        created_at:dayjs(user.createdAt).format('yy-mm-dd')
    }
}

function userCollectionResource(users) {
    return users.map(user => userResource(user));
}

module.exports = { userResource, userCollectionResource };