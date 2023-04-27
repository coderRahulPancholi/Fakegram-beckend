const User = require("../Models/User")
const jwt = require('jsonwebtoken');


const Authuser = async (req,res,next)=>{
    

    try{
        const {token} = req.cookies;

        if(!token){
            res.status(403).json("no token please login")
        }else{
            const verifiedtoken = jwt.verify(token,process.env.JWT_SECREAT)
            if(!verifiedtoken){
                res.json("not a vaild token")
            }else{
                const rootuser = await User.findById({_id:verifiedtoken.id})

               req.user = rootuser

                next()
            }
        }


    }
    catch{
        res.status(500).json("some error")

    }



}

module.exports = Authuser
