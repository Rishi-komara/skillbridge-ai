import { auth } from "../config/firebase.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("1. Token received");

const decodedToken = await auth.verifyIdToken(token);

console.log("2. Token verified");

    

    req.uid = decodedToken.uid;
    req.email = decodedToken.email;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

export default verifyToken;