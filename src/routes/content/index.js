import express from "express";
import {
  publishContent,
  getTimelineContent,
  deleteContent,
  likeOrDislike,
  getContentCount,
  updateContent,
  comment,
  saveContent,
  archiveContents,
  getAllMyArchivedContents,
} from "../../controllers/content/index.js";
import authMiddleWare from "../../middleware/index.js";

const router = express.Router();

router.post("/", publishContent);
router.post("/timeline", getTimelineContent);
router.delete("/:id/:role/:reason", authMiddleWare, deleteContent);
router.put("/:id/like", likeOrDislike);
router.get("/getContentCount", authMiddleWare, getContentCount);
router.put("/updateContent/:id", updateContent);
router.put("/comment", comment);
router.post("/savecontent", saveContent);
router.post("/archivecontent", archiveContents);
router.post("/getallarchivedcontent", getAllMyArchivedContents);

export default router;
