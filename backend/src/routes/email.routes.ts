import express from "express";
import { EmailController } from "../controllers/email.controller";

const router = express.Router();
const emailController = new EmailController();

router.post("/fetch", emailController.fetchEmails);
router.get("/:emailId", emailController.getEmailById);

export default router;
