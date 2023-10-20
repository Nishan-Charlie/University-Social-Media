import mongoose, { ObjectId } from "mongoose";
import ContentModel from "../../model/content/index.js";
import UserModel from "../../model/user/index.js";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

export const publishContent = async (req, res) => {
  const newPost = new ContentModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteContent = async (req, res) => {
  const { id, role, reason } = req.params;
  const { _id } = req.body;
  try {
    const content = await ContentModel.findById(id).populate("users");
    console.log({ content });
    if (content.userId === _id || role === "admin") {
      await content.deleteOne();
      res.status(200).json("Post deleted.");

      if (role === "admin" && content.userId !== _id) {
        let transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.SERVICE_MAIL,
            pass: process.env.SERVICE_MAIL_PASSWORD,
          },
        });

        const currDir = process.cwd();
        const templatePath = path.join(
          currDir,
          "./src/views/content-deleted.html"
        );
        const emailTemplate = fs.readFileSync(templatePath, "utf8");
        const mailOption = {
          from: process.env.SERVICE_MAIL,
          to: content?.users?.email,
          subject: "Your UConnect content removed",
          html: emailTemplate
            .replace("{{username}}", content?.users?.firstname)
            .replace("{{reason}}", reason),
        };
        await transporter.sendMail(mailOption);
      }
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTimelineContent = async (req, res) => {
  try {
    const department = req.body.department;
    const yearOfStudy = req.body.yearOfStudy;
    const id = req.body.id;
    const loggedInUser = req.body.loggedInUser;
    const savedContents = req.body.savedContents;
    const archiveContents = req.body.archiveContents;

    let query = {};
    let contentquery = {};
    let publicContentQuery = {};

    if (id !== "") {
      contentquery.userId = { $in: id };
    }

    if (department || yearOfStudy) {
      const users = await UserModel.find({
        department: department,
        yearOfStudy: yearOfStudy,
      });
      const userIds = users.map((user) => user._id);
      query.users = { $in: userIds };
    }

    if (loggedInUser) {
      const users = await UserModel.find({
        $or: [
          { _id: { $eq: loggedInUser }, accountType: "private" },
          { accountType: "public" },
        ],
      });

      const userIds = users.map((user) => user._id);
      publicContentQuery.users = { $in: userIds };
    }

    if (savedContents) {
      contentquery._id = { $in: savedContents };
    }

    if (archiveContents) {
      contentquery._id = { $in: archiveContents };
    }

    let timelineContents = await ContentModel.find({
      ...contentquery,
      ...query,
      ...publicContentQuery,
    }).populate("users");

    const signedUser = await UserModel.find({
      _id: loggedInUser,
    });

    if (
      signedUser &&
      signedUser[0]?.archiveContents.length > 0 &&
      (archiveContents === undefined || archiveContents === "")
    ) {
      timelineContents = timelineContents.filter(
        (content) => !signedUser[0].archiveContents.includes(content._id)
      );
    }

    for (const content of timelineContents) {
      const comments = await ContentModel.populate(content.comments, {
        path: "user",
        model: "Users",
        select: ["username", "firstname", "lastname", "profilePicture"],
      });
      content.comments = comments;
    }

    res.status(200).json(
      timelineContents.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const likeOrDislike = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const content = await ContentModel.findById(id);
    if (content.likes.includes(userId)) {
      await content.updateOne({ $pull: { likes: userId } });
      res.status(200).json("content disliked");
    } else {
      await content.updateOne({ $push: { likes: userId } });
      res.status(200).json("content liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getContentCount = async (req, res) => {
  try {
    const id = req.body._id;
    const contents = await ContentModel.find({ userId: id });
    res.status(200).json(contents?.length);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateContent = async (req, res) => {
  try {
    const updatedPost = await ContentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).send();
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const comment = async (req, res) => {
  try {
    const { comment, postId, userId } = req.body;
    const comments = {
      user: userId,
      comment,
    };
    const content = await ContentModel.findById(postId);
    content.comments.push(comments);
    await content.save();
    res.status(200).json(content);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export const saveContent = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await UserModel.findByIdAndUpdate(userId, {
      $push: { savedContents: postId },
    });
    res.status(200).json("Content saved successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export const archiveContents = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    await UserModel.findByIdAndUpdate(userId, {
      $push: { archiveContents: postId },
    });
    res.status(200).json("Content archived successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export const getAllMyArchivedContents = async (req, res) => {
  try {
    const loggedInUser = req.body.loggedInUser;

    const user = await UserModel.findById(loggedInUser);

    const archivedContents = await ContentModel.find({
      _id: { $in: user.archiveContents },
    }).populate("users");

    res.status(200).json(
      archivedContents.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
