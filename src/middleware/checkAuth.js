const jwt = require('jsonwebtoken');
require('dotenv').config();

const KEY = process.env.KEY;

module.exports = async (req , res , next) =>{
    const token = req.header('x-auth-token');
    console.log('in auth token ' , token);
    const tokenArray = token.split(' ');
    console.log('token ==> ', token);

    try{
        if(tokenArray[1] === ''){
            req.user = '';
        }else if(tokenArray[1]?.length > 12){
            const user = await jwt.verify(tokenArray[1] , KEY);
            console.log('user ==> ', user);
            req.user = user.email.toLowerCase();
        }else{
            req.user = tokenArray[1];
        }
        
        next();
    }catch(e) {
        console.log('error ==> ', e);
        return res.status(400).json({
            error: [
                {
                    msg: "Token is invalid "
                }
            ]
        })
    }
}