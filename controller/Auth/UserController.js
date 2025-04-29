const AuthService = require('../../services/Auth/AuthServices');
const {userResource,userCollectionResource} = require('../../resource/UserResource');
const user = async (req, res) => {
    const user = await AuthService.getUser();
    return res.status(200).json({
        message: "user data ",
        user:userResource(user)
    })
}
module.exports={user}
