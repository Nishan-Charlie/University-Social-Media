import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;
