import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

const JWT_XSRF_TOKEN_EXPIRY = "1d" // Make me configurable - should probably match refresh token expiry

const generateXsrfToken = () => {
  const secret = process.env.JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")
  return jwt.sign({ XSRF_TOKEN: "🔒" }, secret, {
    expiresIn: JWT_XSRF_TOKEN_EXPIRY,
  })
}

export default generateXsrfToken
