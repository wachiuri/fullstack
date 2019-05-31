const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    let token = req.header("USER-KEY");
    if (!token) {
        res.status(401);
        res.send({
            code: "AUT_01",
            message: "Authorization code is empty"
        });
        res.end();
        return;
    }
    
    if(token.substring(0,7)==="Bearer "){
        token=token.substring(7,token.length);
    }
    
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400);
        res.send({
            code: "AUT_03",
            message: "Invalid web token"
        });
        res.end();
        return;
    }
}
;

