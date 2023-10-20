import express from "express";
import Chats2 from "../../model/chats2/index.js";

export const getChats = async () => {
  await Chats2.find()
    .populate("sender")
    .exec((err, chats) => {
      console.log(chats);
      if (err) return res.status(400).send(err);
      res.status(200).send(chats);
    });
};
