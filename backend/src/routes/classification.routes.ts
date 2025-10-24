import express from "express";
import { ClassificationController } from "../controllers/classification.controller";

const router = express.Router();
const classificationController = new ClassificationController();

router.post("/openai", classificationController.classifyWithOpenAI);
router.post("/gemini", classificationController.classifyWithGemini);
router.post("/stats", classificationController.getClassificationStats);

export default router;
