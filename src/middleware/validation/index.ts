import validateEmail from "./validateEmail"
import validateTokenId from "./validateTokenId"
import validateUserMeta from "./validateUserMeta"
// TODO: Validate Password Strength

const VALIDATE = { email: validateEmail, tokenId: validateTokenId, userMeta: validateUserMeta }

export default VALIDATE
