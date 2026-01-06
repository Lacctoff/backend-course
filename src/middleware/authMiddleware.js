import jwt from 'jsonwebtoken';
import { prisma } from "../config/db.js";


// todo - get the token from the request in the header
// verify if the token is valid.
export const authMiddleware = async (req, res, next) => {
  console.log("Middleware reached");

  let token;

  //this logics says if there is authorization in the headers and that authorization starts with Bearer, set token to that authorization key after bearer
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  };

  // if there is no token return and error
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  };

  2. // verify if the token is valid.
  try {
    // verify token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "user no longer exists" });
    }

    //if all the checks pass: now every route that uses the middleware, can access the userid from the req headers instead of the body
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }

};