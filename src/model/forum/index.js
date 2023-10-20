import mongoose from "mongoose";

const forumSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    question: { type: String, required: true },
    desc: { type: String, required: true },
    votes: [],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    answers: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "Users",
          require: false,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

var ForumModel = mongoose.model("Forum", forumSchema);

export default ForumModel;
