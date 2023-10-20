import express from "express";
import {
  getUser,
  updateUser,
  getAllUsers,
  follow,
  unfollow,
  getAllUsersWithoutCurrentUser,
  verifiedUser,
  userVerification,
  forgotPassword,
  resetPassword,
  getFollowRequests,
  acceptFollowRequest,
  getAllFollowers,
  getAllFollowing,
  rejectFollowRequest,
  getAllSuggestedUsers,
  deleteUser,
  activateAlumni,
} from "../../controllers/user/index.js";
import authMiddleWare from "../../middleware/index.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", authMiddleWare, updateUser);
router.post("/", getAllUsers);
router.put("/:id/follow", authMiddleWare, follow);
router.put("/:id/unfollow", authMiddleWare, unfollow);
router.get("/getothers/:id/:username?", getAllUsersWithoutCurrentUser);
router.get("/verified", verifiedUser);
router.get("/verify/:userId/:uniqString", userVerification);
router.get("/alumni-verify/:userId/:uniqString", activateAlumni);
router.post("/resetpassword", forgotPassword);
router.post("/reset-new-password", resetPassword);
router.get("/getfollowrequests/:id", getFollowRequests);
router.post("/acceptfollowrequest", acceptFollowRequest);
router.post("/rejectfollowrequest", rejectFollowRequest);
router.get("/getallfollowers/:id", getAllFollowers);
router.get("/getallfollowing/:id", getAllFollowing);
router.post("/getallsuggestedusers", getAllSuggestedUsers);
router.delete("/:id/:reason", deleteUser);

export default router;
