import { googleCallback } from "./auth/googleCallback"
import { login } from "./auth/login"
import { logout } from "./auth/logout"
import { magic } from "./auth/magic"
import { magicToken } from "./auth/magicToken"
import { requestPasswordReset } from "./auth/requestPasswordReset"
import { resetPassword } from "./auth/resetPassword"
import { validateAccount } from "./auth/validateAccount"
import { createUser } from "./users/createUser"
import { deleteUser } from "./users/deleteUser"
import { getAllUsers } from "./users/getAllUsers"
import { getSelf } from "./users/getSelf"
import { getUser } from "./users/getUser"
import { updateUser } from "./users/updateUser"

const CONTROLLERS = {
  AUTH: {
    googleCallback,
    login,
    logout,
    magic,
    magicToken,
    requestPasswordReset,
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
  },
}

export default CONTROLLERS
