const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) return res.status(403).json({ message: "No Token!" });

      const decoded = jwt.verify(token, process.env.SECRET);

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      next();
    }
  } catch (err) {
    next(err);
  }
};
