const JWT = require('jsonwebtoken')

const User = require('../model/user')

const authMiddleware  = async(req,res,next) =>{
    try{
    const token = req.header('Authorization')
    const user = JWT.verify(token, process.env.JWT_SECRET)

     User.findById(user.userId)
    .then((user)=>{
        req.user = user
        next()
        return
    })
    .catch(err=>console.log(err)) 
     
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'middleware issue , check there' });
    }

}
module.exports = {authMiddleware}