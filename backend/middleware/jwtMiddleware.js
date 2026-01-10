require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.verifyAccess = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth)
        return res.sendStatus(401);

    const token = auth.split(' ')[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err,decoded) => {
        if(err)
            return res.sendStatus(403);
        req.userId = decoded.userId;
        next();
    });
}