const dayjs = require('dayjs');
 function userResource(user)
{
    const avatarPath = user.avatar ? `${process.env.APP_URL}/${user.avatar}` : null;
    return{
        id:user._id,
        name:user.name,
        email:user.email,
        email_verified_at:user.email_verified_at,
        phone:user.phone,
        phone_verified_at:user.phone_verified_at,
        avatar:avatarPath,
        created_at:dayjs(user.createdAt).format('YY-MM-DD'),
        updated_at:dayjs(user.updatedAt).format('YY-MM-DD'),
    }
}

function userCollectionResource(users) {
    return users.map(user => userResource(user));
}

module.exports = { userResource, userCollectionResource };