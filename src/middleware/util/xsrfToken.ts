import jwt from "jsonwebtoken"
import { JWT_TOKEN_SECRET } from "../../config"

const JWT_XSRF_TOKEN_EXPIRY = "1d" // Make me configurable - should probably match refresh token expiry

const generateXsrfToken = () => {
  const secret = JWT_TOKEN_SECRET
  if (secret == null) throw new Error("JWT secret not found")
  return jwt.sign({ XSRF_TOKEN: "🔒" }, secret, {
    expiresIn: JWT_XSRF_TOKEN_EXPIRY,
  })
}

export default generateXsrfToken
