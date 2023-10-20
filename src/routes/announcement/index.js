import express from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
} from "../../controllers/announcement/index.js";

const router = express.Router();
router.post("/", createAnnouncement);
router.get("/", getAllAnnouncements);

export default router;
