import { getUserByID, getUserByEmail } from "./user/getUser"
import { getAllUsers } from "./user/getAllUsers"

const SERVICES = {
  getAllUsers,
  getUserByID,
  getUserByEmail,
}

export default SERVICES
