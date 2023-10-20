import mongoose from "mongoose";

const announcementSchema = mongoose.Schema(
  {
    announcement: {
      type: String,
      required: true,
    },
    users: [{ type: mongoose.Types.ObjectId, ref: "Users", require: false }],
  },
  { timestamps: true }
);

var AnnouncementModel = mongoose.model("Announcement", announcementSchema);

export default AnnouncementModel;
