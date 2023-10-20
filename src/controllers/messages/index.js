import MessageModel from "../../model/messages/index.js";
export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await MessageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      console.log({ msg });
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        type: msg.type,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message, type } = req.body;
    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      type: type,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
