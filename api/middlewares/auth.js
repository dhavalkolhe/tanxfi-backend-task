import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createAccessToken = (load) => {
  const token = jwt.sign(load, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  return token;
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token not provided.",
    });
  }

  try {
    // Verify the token
    console.log("Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded user information to the request for further use
    req.user = decoded;
    console.log("Decoded: ", decoded);

    next();
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};
