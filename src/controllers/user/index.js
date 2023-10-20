import UserModel from "../../model/user/index.js";
import UserVerificationModel from "../../model/userVerification/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "path";
import PasswordResetModel from "../../model/passwordReset/index.js";
import fs from "fs";
import { io } from "../../../index.js";
import { createNotification } from "../notification/index.js";
import ContentModel from "../../model/content/index.js";

const sendVerificationMail = async ({ _id, email }, res) => {
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

  const clientURI = process.env.CLIENT_URI;
  const uniqString = uuidv4() + _id;
  const currDir = process.cwd();
  const templatePath = path.join(
    currDir,
    "./src/views/email-verification.html"
  );
  const appName = "Social Media Platform";
  const emailTemplate = fs.readFileSync(templatePath, "utf8");
  const verificationURI = clientURI + "user/verify/" + _id + "/" + uniqString;

  const mailOption = {
    from: process.env.SERVICE_MAIL,
    to: email,
    subject: "Verify Your Email",
    html: emailTemplate
      .replace("{{verificationURI}}", verificationURI)
      .replace("{{appName}}", appName),
  };
  try {
    const salt = 10;
    await bcrypt.hash(uniqString, salt).then(async (hashedUniqString) => {
      const payload = {
        userId: _id,
        uniqString: hashedUniqString,
        expiresAt: Date.now() + 21600000,
      };
      const newVerification = new UserVerificationModel(payload);
      await newVerification.save();
      await transporter
        .sendMail(mailOption)
        .then((res) => {})
        .catch((err) => {
          console.log({ err });
        });
      res.status(200).json({ message: "Verification Mail Sent" });
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: error.message });
  }
};

const sendVerificationMailToAdmin = async (
  { _id, email, studentId, firstname },
  res
) => {
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

  const clientURI = process.env.CLIENT_URI;
  const uniqString = uuidv4() + _id;
  const currDir = process.cwd();
  const templatePath = path.join(currDir, "./src/views/request-student.html");
  const appName = "Social Media Platform";
  const emailTemplate = fs.readFileSync(templatePath, "utf8");
  const verificationURI =
    clientURI + "user/alumni-verify/" + _id + "/" + uniqString;
  const studentID = studentId;
  const studentName = firstname;
  const emailAddress = email;

  const mailOption = {
    from: process.env.SERVICE_MAIL,
    to: process.env.ADMIN_MAIL,
    subject: "Verify Your Email",
    html: emailTemplate
      .replace("{{verificationURI}}", verificationURI)
      .replace("{{appName}}", appName)
      .replace("{{studentID}}", studentID)
      .replace("{{studentName}}", studentName)
      .replace("{{emailAddress}}", emailAddress),
  };
  try {
    const salt = 10;
    await bcrypt.hash(uniqString, salt).then(async (hashedUniqString) => {
      const payload = {
        userId: _id,
        uniqString: hashedUniqString,
        expiresAt: Date.now() + 21600000,
      };
      const newVerification = new UserVerificationModel(payload);
      await newVerification.save();
      await transporter
        .sendMail(mailOption)
        .then((res) => {})
        .catch((err) => {
          console.log({ err });
        });
      res.status(200).json({ message: "Verification Mail Sent" });
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: error.message });
  }
};

export const userVerification = async (req, res) => {
  const { userId, uniqString } = req.params;
  try {
    const user = await UserVerificationModel.find({
      userId,
    });
    if (user.length > 0) {
      const { expiresAt } = user[0];
      const hasheduniqString = user[0]?.uniqString;
      if (expiresAt < Date.now()) {
        UserVerificationModel.deleteOne({ userId })
          .then((res) => {
            UserModel.deleteOne({
              _id: userId,
            })
              .then((res) => {
                let mgs = "Link hasbeen expired please signup again";
                res.redirect(`/user/verified/error=true&message=${mgs}`);
              })
              .catch((err) => {
                let mgs = "Error while removing expired user";
                res.redirect(`/user/verified/error=true&message=${mgs}`);
              });
          })
          .catch((err) => {
            let mgs = "Error while removing expired record";
            res.redirect(`/user/verified/error=true&message=${mgs}`);
          });
      } else {
        bcrypt
          .compare(uniqString, hasheduniqString)
          .then((response) => {
            if (response) {
              UserModel.updateOne(
                {
                  _id: userId,
                },
                { isVerified: true }
              ).then(() => {
                UserVerificationModel.deleteOne({
                  userId,
                }).then(() => {
                  const currDir = process.cwd();
                  res.sendFile(path.join(currDir, "./src/views/verified.html"));
                });
              });
            } else {
              let msg = "Invalid verification details";
              res.redirect(`/user/verified/error=true/message${msg}`);
            }
          })
          .catch((err) => {
            let mgs = "Error while compare uniq string";
            res.redirect(`/user/verified/error=true&message=${mgs}`);
          });
      }
    } else {
      let msg = "Account already verified already. Please singin";
      res.redirect(`/user/verified/error=true&message=${msg}`);
    }
  } catch (error) {
    let msg = "Error while checking existing user";
    res.redirect(`/user/verified/error=true&message=${msg}`);
    res.status(500).json({ message: error.message });
  }
};

export const activateAlumni = async (req, res) => {
  const { userId, uniqString } = req.params;
  try {
    const user = await UserVerificationModel.find({
      userId,
    });
    const userData = await UserModel.find({
      _id: userId,
    });
    if (user.length > 0) {
      const { expiresAt } = user[0];
      const hasheduniqString = user[0]?.uniqString;
      if (expiresAt < Date.now()) {
        UserVerificationModel.deleteOne({ userId })
          .then((res) => {
            UserModel.deleteOne({
              _id: userId,
            })
              .then((res) => {
                let mgs = "Link hasbeen expired please signup again";
                res.redirect(`/user/verified/error=true&message=${mgs}`);
              })
              .catch((err) => {
                let mgs = "Error while removing expired user";
                res.redirect(`/user/verified/error=true&message=${mgs}`);
              });
          })
          .catch((err) => {
            let mgs = "Error while removing expired record";
            res.redirect(`/user/verified/error=true&message=${mgs}`);
          });
      } else {
        bcrypt
          .compare(uniqString, hasheduniqString)
          .then((response) => {
            if (response) {
              UserModel.updateOne(
                {
                  _id: userId,
                },
                { isVerified: true }
              ).then(() => {
                UserVerificationModel.deleteOne({
                  userId,
                }).then(async () => {
                  const currDir = process.cwd();
                  res.sendFile(
                    path.join(currDir, "./src/views/activate-alumni.html")
                  );
                  console.log({ userData });
                  await sendMailToAlumniStudent(userData[0]);
                });
              });
            } else {
              let msg = "Invalid verification details";
              res.redirect(`/user/verified/error=true/message${msg}`);
            }
          })
          .catch((err) => {
            let mgs = "Error while compare uniq string";
            res.redirect(`/user/verified/error=true&message=${mgs}`);
          });
      }
    } else {
      let msg = "Account already verified already. Please singin";
      res.redirect(`/user/verified/error=true&message=${msg}`);
    }
  } catch (error) {
    let msg = "Error while checking existing user";
    res.redirect(`/user/verified/error=true&message=${msg}`);
    res.status(500).json({ message: error.message });
  }
};

export const sendMailToAlumniStudent = async ({
  email,
  firstname,
  studentId,
}) => {
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
  const templatePath = path.join(currDir, "./src/views/activated-student.html");
  const emailTemplate = fs.readFileSync(templatePath, "utf8");
  const name = firstname;

  const mailOption = {
    from: process.env.SERVICE_MAIL,
    to: email,
    subject: "Albany alumni account hasbeen activated",
    html: emailTemplate
      .replace("{{studentName}}", name)
      .replace("{{studentID}}", studentId)
      .replace("{{emailAddress}}", email),
  };
  await transporter.sendMail(mailOption);
};

export const verifiedUser = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../../views/verified.html"));
  } catch (error) {}
};

export const sendResetPasswordMail = async ({ _id, email }, res) => {
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

  const clientURI = process.env.CLIENT_URI;
  const uniqString = uuidv4() + _id;

  const currDir = process.cwd();
  const templatePath = path.join(currDir, "./src/views/reset-password.html");
  const emailTemplate = fs.readFileSync(templatePath, "utf8");
  const redirectURL = process.env.CLIENT_LINK;
  const URI = redirectURL + "reset-password" + "/" + _id + "/" + uniqString;

  const mailOption = {
    from: process.env.SERVICE_MAIL,
    to: email,
    subject: "Verify Your Email",
    html: emailTemplate.replace("{{URI}}", URI),
  };
  try {
    const salt = 10;
    await bcrypt.hash(uniqString, salt).then(async (hashedUniqString) => {
      const payload = {
        userId: _id,
        uniqString: hashedUniqString,
        expiresAt: Date.now() + 21600000,
      };
      const newReset = new PasswordResetModel(payload);
      await newReset.save();
      await transporter
        .sendMail(mailOption)
        .then((res) => {
          console.log({ res });
        })
        .catch((err) => {
          console.log({ err });
        });
      res.status(200).json({ message: "Reseting Mail Sent" });
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      sendResetPasswordMail(isUserExist, res);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const resetPassword = async (req, res) => {
  const { userId, uniqString, newPassword } = req.body;
  try {
    const response = await PasswordResetModel.find({ userId });
    if (response.length > 0) {
      const hashedUniqString = response[0]?.uniqString;

      bcrypt
        .compare(uniqString, hashedUniqString)
        .then((data) => {
          if (data) {
            const salt = 10;
            bcrypt
              .hash(newPassword, salt)
              .then((result) => {
                UserModel.updateOne({ _id: userId }, { password: result }).then(
                  (result) => {
                    PasswordResetModel.deleteOne({ userId }).then((deleted) => {
                      res
                        .status(200)
                        .json("Password hasbeen reset successfully");
                    });
                  }
                );
              })
              .catch((err) => {
                res.json(err.message);
              });
          }
        })
        .catch((err) => {
          res.json(err);
        });
    } else {
      res.status(400).json({ message: "Password reset details not found!" });
    }
  } catch (error) {
    console.log({ error });
  }
};

export const register = async (req, res) => {
  const { email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  const payload = {
    _id: mongoose.Types.ObjectId(),
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    isVerified: false,
    studentType: req.body.studentType,
    studentId: req.body.studentId,
    company: req.body.company,
    designation: req.body.designation,
    experience: req.body.experience,
  };
  const newUser = new UserModel(payload);
  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    const user = await newUser.save();
    if (user) {
      if (req.body.studentType === "alumniStudent") {
        await sendVerificationMailToAdmin(user, res);
      } else {
        await sendVerificationMail(user, res);
      }
    }
    // const token = jwt.sign({ email: user.email, id: user._id }, "qwerty");
    // res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      if (!user.isVerified) {
        res
          .status(400)
          .json("Your email hasn't been verified yet. check your inbox");
      } else {
        const validity = await bcrypt.compare(password, user.password);
        if (!validity) {
          res.status(400).json("Incorrect Password");
        } else {
          const token = jwt.sign(
            { username: user.username, id: user._id },
            "qwerty"
          );
          res.status(200).json({ user, token });
        }
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, currentUserAdmin, password } = req.body;

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        "qwerty"
      );
      res.status(200).json({ user, token });
    } catch (error) {
      console.log({ error });
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
};

export const getAllUsersWithoutCurrentUser = async (req, res, next) => {
  try {
    let query = { _id: { $ne: req.params.id } };
    let username = req.params.username;
    let usernameQuery = {};
    if (username) {
      usernameQuery = { username: { $regex: username, $options: "i" } };
    }

    console.log({ usernameQuery });
    const users = await UserModel.find({ ...query, ...usernameQuery }).select([
      "email",
      "username",
      "profilePicture",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { username } = req.body;
    let query = {};
    if (username) {
      query = {
        username: { $regex: username, $options: "i" },
        isAdmin: { $ne: true },
      };
    } else {
      query = { isAdmin: { $ne: true } };
    }
    let users = await UserModel.find(query);
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllSuggestedUsers = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("--------------------------", userId);
    // Find the logged-in user by their ID
    const loggedInUserId = userId; // Assuming you have implemented authentication and have the logged-in user's ID in the request object

    // Find all users who are not in the 'following' array of the logged-in user
    const usersNotFollowing = await UserModel.find(
      {
        _id: { $ne: loggedInUserId },
        followers: { $ne: loggedInUserId },
        isAdmin: { $ne: true },
      },
      "_id username firstname lastname profilePicture accountType followers following followRequests savedContents archiveContents studentType studentId"
    ); // Find all user documents whose '_id' is not equal to the logged-in user's ID and whose 'followers' array does not contain the logged-in user's ID. Only return the '_id' and 'username' fields of the user documents.

    res.json(usersNotFollowing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const follow = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (followUser.accountType === "private") {
        // For private accounts, send a follow request
        await followUser.updateOne({ $push: { followRequests: _id } });
        res.status(200).json("Follow request sent!");
      } else {
        // For public accounts, follow directly
        if (!followUser.followers.includes(_id)) {
          await followUser.updateOne({ $push: { followers: _id } });
          await followingUser.updateOne({ $push: { following: id } });
          res.status(200).json("User followed!");
        } else {
          res.status(403).json("You are already following this user");
        }
      }
      await createNotification(
        followUser,
        `${followingUser?.username} started following you.`,
        followingUser?.profilePicture,
        followingUser?._id
      );
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

export const acceptFollowRequest = async (req, res) => {
  const { _id, id } = req.body;

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    if (
      followUser.accountType === "private" &&
      !followUser.followers.includes(_id)
    ) {
      res.status(403).json("Action Forbidden: User is not following you");
    } else {
      await followUser.updateOne({
        $push: { following: _id },
      });
      await followingUser.updateOne({
        $push: { followers: id },
        $pull: { followRequests: id },
      });
      res.status(200).json("Follow request accepted!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const rejectFollowRequest = async (req, res) => {
  const { _id, id } = req.body;

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    await followUser.updateOne({
      $pull: { followers: _id },
    });
    await followingUser.updateOne({
      $pull: { followRequests: id },
    });
    res.status(200).json("Follow request rejected!");
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getFollowRequests = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId).populate("followRequests");
    res.status(200).json(user?.followRequests);
  } catch (error) {
    console.log({ error });
    res.status(500).json(error);
  }
};

export const getAllFollowers = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId).populate("followers");
    res.status(200).json(user?.followers);
  } catch (error) {
    console.log({ error });
    res.status(500).json(error);
  }
};

export const getAllFollowing = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId).populate("following");
    res.status(200).json(user?.following);
  } catch (error) {
    console.log({ error });
    res.status(500).json(error);
  }
};

// Unfollow a User
// changed
export const unfollow = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unFollowUser = await UserModel.findById(id);
      const unFollowingUser = await UserModel.findById(_id);

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } });
        await unFollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("Unfollowed Successfully!");
      } else {
        res.status(403).json("You are not following this User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// export const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     await UserModel.findByIdAndDelete(userId);
//     return res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const reason = req.params.reason;

    // Delete user's content
    await ContentModel.deleteMany({ userId });

    // Delete user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await UserModel.findByIdAndDelete(userId);
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
    const templatePath = path.join(currDir, "./src/views/user-deleted.html");
    const emailTemplate = fs.readFileSync(templatePath, "utf8");
    const mailOption = {
      from: process.env.SERVICE_MAIL,
      to: user?.email,
      subject: "Your UConnect account removed",
      html: emailTemplate
        .replace("{{username}}", user?.firstname)
        .replace("{{reason}}", reason),
    };
    await transporter.sendMail(mailOption);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
