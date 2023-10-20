import { io } from "../../../index.js";
import NotificationModel from "../../model/notification/index.js";

export const createNotification = async (user, title, profile, senderId) => {
  try {
    await NotificationModel.create({
      title,
      userId: user,
      senderId: senderId,
    });
    io.to(`user_${user}`).emit("notification", {
      title: title,
      time: Date.now(),
      profile: profile,
    });
  } catch (err) {
    console.log({ err });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await NotificationModel.find({ userId: id })
      .populate("senderId", "profilePicture") // Include the associated user data
      .exec();
    res.json(notifications);
  } catch (err) {
    console.log({ err });
  }
};
