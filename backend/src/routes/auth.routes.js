// routes/auth.routes.js
import { Router } from "express";
import {
  googleLogin,
  googleCallback,
  githubLogin,
  githubCallback,
  discordLogin,
  discordCallback,
} from "../controllers/auth.controller.js";

const router = Router();

/* ---------------------- GOOGLE ---------------------- */
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

/* ---------------------- GITHUB ---------------------- */
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

/* ---------------------- DISCORD ---------------------- */
router.get("/discord", discordLogin);
router.get("/discord/callback", discordCallback);

export default router;
