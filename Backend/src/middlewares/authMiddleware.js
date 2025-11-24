const jwt = require ( "jsonwebtoken" );


//keep the roles that are allowed in that route in allowedRoles = [] 
const verifyToken = (allowedRoles = []) => 
    (req, res, next) => {
    
    const token = req.body.token;

    if (!token){
        return res.status(401).json({message: "No token. Authorization denied"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) 
        {
            return res.status(403).json({message: "Access Denied"});
        }
        next()
    }
    catch (err){
        res.status(400).json({ message: "Token is not valid" });
    }
    
};

module.exports = verifyToken