import { Router } from "express"
import CONTROLLERS from "../../controllers"
import MW from "../../middleware"

const router = Router()

router.patch(
  "/validate/:tokenId.:userId",
  MW.VALIDATE.tokenId,
  MW.findValidTokenById,
  MW.discardToken,
  CONTROLLERS.AUTH.validateAccount
)

export default router
