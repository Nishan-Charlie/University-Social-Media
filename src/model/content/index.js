import mongoose from "mongoose";

const contentSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, required: false },
    likes: [],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    image: String,
    video: String,
    comments: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "Users",
          require: false,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    users: { type: mongoose.Types.ObjectId, ref: "Users", require: false },
  },
  {
    timestamps: true,
  }
);

var ContentModel = mongoose.model("Contents", contentSchema);

export default ContentModel;
