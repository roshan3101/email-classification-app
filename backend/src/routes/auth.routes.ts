import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const authController = new AuthController();

router.get("/google", authController.getGoogleAuthUrl);
router.get("/google/callback", authController.handleGoogleCallback);

router.post("/refresh", authController.refreshToken);
router.post("/revoke", authController.revokeToken);

export default router;