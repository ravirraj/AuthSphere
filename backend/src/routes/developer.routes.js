import { Router } from "express";
import { 
  registerDeveloper, 
  loginDeveloper, 
  logoutDeveloper, 
  refreshAccessToken,
  getCurrentDeveloper 
} from "../controllers/developer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerDeveloper);
router.route("/login").post(loginDeveloper);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutDeveloper);
router.route("/me").get(verifyJWT, getCurrentDeveloper); 

export default router;