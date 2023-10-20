import express from "express";
import { getAllNotifications } from "../../controllers/notification/index.js";

const router = express.Router();

router.get("/:id", getAllNotifications);

export default router;
