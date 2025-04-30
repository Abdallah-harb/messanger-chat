const AuthService = require('../../services/Auth/AuthServices');
const {userResource,userCollectionResource} = require('../../resource/UserResource');
const User = require('../../model/UserModel')
const user = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        return res.status(200).json({
            status:200,
            message: "user data ",
            user:userResource(user)
        })
    }catch (e) {
        return  res.status(500).json({
            status:500,
            message: e.message
        })
    }

}
module.exports={user}
