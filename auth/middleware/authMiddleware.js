const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  //   console.log("req to testing and learning purpose", req);
  if (!authHeader) {
    return res.status(401).json({ error: "No Token Provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token Missing" });
  }
  const decoded = jwt.verify(token, "secret");
  req.user = decoded;
  next();
  try {
  } catch (error) {
    console.error(error);
  }
};

module.exports = authMiddleware;
