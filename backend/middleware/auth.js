const jwt = require("jsonwebtoken");
const db = require("../models/index");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.Token);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    req.admin = { isAdmin };
    //req.auth = { userId };

    const user = await db.User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    } else if (req.body.userId && req.body.userId !== userId) {
      return res.status(401).json({ message: "Requête non autorisée" });
    } else {
      req.auth = { userId };
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
