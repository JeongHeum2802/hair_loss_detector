require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.verifyAccess = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth)
        return res.sendStatus(401);

    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

        req.user = {
            userId: decoded.userId
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "유효하지 않은 토큰!" });
    }
}