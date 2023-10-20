import AnnouncementModel from "../../model/announcement/index.js";
import { createNotification } from "../notification/index.js";

export const createAnnouncement = async (req, res) => {
  const { announcement, users, senderId } = req.body;

  try {
    const response = await AnnouncementModel.create({
      announcement,
      users,
    });
    // Send notification to all users using for...of loop
    for (const userId of users) {
      await createNotification(userId, announcement, "", senderId);
    }
    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log({ error });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await AnnouncementModel.find().populate("users");

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.log({ error });
  }
};
