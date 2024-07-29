import { createUser } from "./users/createUser"
import { deleteUser } from "./users/deleteUser"
import { getAllUsers } from "./users/getAllUsers"
import { getSelf } from "./users/getSelf"
import { getUser } from "./users/getUser"
import { googleCallback } from "./auth/googleCallback"
import { login } from "./auth/login"
import { logout } from "./auth/logout"
import { magicLogin } from "./auth/magicLogin"
import { magicLoginWithToken } from "./auth/magicLoginWithToken"
import { resetPassword } from "./auth/resetPassword"
import { resetPasswordWithToken } from "./auth/resetPasswordWithToken"
import { updateUser } from "./users/updateUser"
import { updateUserMeta } from "./users/updateUserMeta"
import { validateAccount } from "./auth/validateAccount"
import { refreshToken } from "./auth/refreshToken"

const CONTROLLERS = {
  AUTH: {
    googleCallback,
    login,
    logout,
    magicLogin,
    magicLoginWithToken,
    refreshToken,
    resetPasswordWithToken,
    resetPassword,
    validateAccount,
  },
  USER: {
    createUser,
    deleteUser,
    getAllUsers,
    getSelf,
    getUser,
    updateUser,
    updateUserMeta,
  },
}

export default CONTROLLERS
