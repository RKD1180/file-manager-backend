const jwt = require('jsonwebtoken');


exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.json({error:{ message: "Access Denied", status: 403 }})
        }

        if (token.startsWith("Bearer ")) {
            const exactToken = token.slice(7, token.length).trimLeft();
            const decoded = jwt.verify(exactToken, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
    } catch (error) {
        return res.json({error: { message: "Token not found", status: 401 }})
    }
}