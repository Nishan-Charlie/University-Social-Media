import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// routes
import AuthRoute from "./src/routes/auth/index.js";
import UserRoute from "./src/routes/user/index.js";
import BucketRoute from "./src/routes/bucket/index.js";
import ChatRoute from "./src/routes/chat/index.js";
import MessageRoute from "./src/routes/messages/index.js";
import ContentRoute from "./src/routes/content/index.js";
import NotificationRoute from "./src/routes/notification/index.js";
import ForumRoute from "./src/routes/forum/index.js";
import AnnouncementRoute from "./src/routes/announcement/index.js";
import HelpRoute from "./src/routes/help/index.js";

const onlineUsers = new Map();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static("src/uploads"));
app.use("/images", express.static("images"));

dotenv.config();
const PORT = process.env.PORT;
const CONNECTION = process.env.MONGO_URI;

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    server.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
  )
  .catch((error) => console.log(`${error} did not connect`));

let activeUsers = [];

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    console.log({ userId });
    onlineUsers.set(userId, socket.id);
    if (!activeUsers.some((user) => user.userId === userId)) {
      activeUsers.push({ userId: userId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("online-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("online-users", activeUsers);
  });

  socket.on("send-msg", (data) => {
    console.log("-----soc-send", data);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log("-----soc-rece", sendUserSocket);
      socket
        .to(sendUserSocket)
        .emit("msg-recieve", { msg: data.newMessage, type: data.type });
    }
  });

  const userId = socket.handshake.query.userId;
  socket.join(`user_${userId}`);

  console.log({ userId });
  // Send notification to user
});

import multer from "multer";
import fs from "fs";
import Chats2 from "./src/model/chats2/index.js";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // fileFilter: (req, file, cb) => {
  //   const ext = path.extname(file.originalname)
  //   if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
  //     return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
  //   }
  //   cb(null, true)
  // }
});

var upload = multer({ storage: storage }).single("file");

app.post("/api/chat/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    console.log("++++++++++++++++", res.req.file);
    return res.json({
      success: true,
      url: res.req?.file?.filename,
    });
  });
});

io.on("connection", (socket) => {
  socket.on("Input Chat Message", (msg) => {
    try {
      let chat = new Chats2({
        message: msg.chatMessage,
        sender: msg.userId,
        type: msg.type,
      });

      chat.save((err, doc) => {
        console.log(doc);
        if (err) return res.json({ success: false, err });

        Chats2.find({ _id: doc._id })
          .populate("sender")
          .exec((err, doc) => {
            console.log({ doc });
            console.log({ err });
            return io.emit("Output Chat Message", doc);
          });
      });
    } catch (error) {
      console.error(error);
    }
  });
});

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/bucket", BucketRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/content", ContentRoute);
app.use("/notification", NotificationRoute);
app.use("/forum", ForumRoute);
app.use("/announcement", AnnouncementRoute);
app.use("/help", HelpRoute);
