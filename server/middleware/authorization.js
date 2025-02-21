import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authorization = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(403).json({ error: "Authorization header is missing" });

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.jwtSecret);
    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).send("Not Authorized");
  }
};

export { authorization };
