import express from "express";
import {
  answer,
  deleteQuestion,
  getAllAnswersByForumId,
  getAllQuestions,
  publishQuestion,
} from "../../controllers/forum/index.js";

const router = express.Router();

router.post("/", publishQuestion);
router.post("/getallquestion", getAllQuestions);
router.put("/answer", answer);
router.post("/getallanswersbyforumid", getAllAnswersByForumId);
router.delete("/:id", deleteQuestion);

export default router;
