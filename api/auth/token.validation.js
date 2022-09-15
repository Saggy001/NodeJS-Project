const {verify} = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next)=>{
        let token = req.get("Authorization");
        if(token){
            token = token.slice(7);
            verify(token , process.env.HASH_KEY, (err, decoded)=>{
                if(err){
                    return res.status(401).json({
                        message: "Unauthorized user"
                    })
                }
                else{
                    req.myID = decoded.result.id;
                    next();
                }
            })
        }
        else{
            return res.status(401).json({
                message: "Unauthorized user"
            });
        }
    }
};