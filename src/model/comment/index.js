import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    comment: { type: String, required: true },
    contentId: { type: String, require: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    users: { type: mongoose.Types.ObjectId, ref: "Users", require: false },
  },
  {
    timestamps: true,
  }
);

var CommentsModel = mongoose.model("Comments", commentSchema);

export default CommentsModel;
