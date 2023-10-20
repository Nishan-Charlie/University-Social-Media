import express from "express";
import {
  createChat,
  findChat,
  userChats,
} from "../../controllers/chat/index.js";
import { getChats } from "../../controllers/chats2/index.js";
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.get("getChats", getChats);

export default router;
