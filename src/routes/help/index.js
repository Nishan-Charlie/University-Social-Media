import express from "express";
import { sendHelpQuestion } from "../../controllers/help/index.js";

const router = express.Router();

router.post("/", sendHelpQuestion);

export default router;
