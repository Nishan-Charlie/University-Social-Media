import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    message: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const Chats2 = mongoose.model("Chats2", chatSchema);
export default Chats2;
