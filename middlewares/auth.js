const jwt = require("jsonwebtoken");

exports.authenticated = (req, res, next) => {
    const authHeader = req.get("Authorization");

    try {
        if (!authHeader) {
            return res.status(400).json({ message: "مجوز کافی ندارید" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.status(400).json({ message: "مجوز کافی ندارید" });
        }

        req.userId = decodedToken.user.userId;
        next();
    } catch (err) {
        next(err);
    }
};
