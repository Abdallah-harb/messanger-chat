const jwt = require('jsonwebtoken');
const checkAuth = (req,res,next)=>{
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (!authHeader) {
        return res.status(401).json({status: 401,message: "unauthenticated"});
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({status: 401,message: "unauthenticated"});
    }
    try {
        const decodedToken = jwt.verify(token, 'secret');
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ status: 401, message: "unauthenticated" });
    }
}
module.exports=checkAuth;