const ChatBox = require("../models/ChatBox");
const asyncHandler = require("express-async-handler");

exports.chatbox_get_all = asyncHandler(async (req, res, next) => {
  const chatboxes = await ChatBox.find().exec();

  if (chatboxes.length === 0)
    return res.json({ status: "failed", msg: "No ChatBoxes" });
  res.json({
    status: "success",
    chatboxes: chatboxes,
    msg: "Retreiving all chatboxes success",
  });
});
// exports.chatbox_get_chatbox = asyncHandler(async(req,res,next)=>{
//   const chatbox = await ChatBox.find()
// })
exports.chatbox_add_message = [
  asyncHandler(async (req, res, next) => {
    const existingChatbox = await ChatBox.find({
      users: { $in: [req.body.message.sender, req.body.message.receiver] },
    });

    if (existingChatbox.length !== 0) {
      existingChatbox[0].messages.push(req.body.message);
      await existingChatbox[0].save();
      return res.json({ status: "success", msg: "added messages to chatbox" });
    }

    const users = [req.body.message.sender, req.body.message.receiver];
    const chatbox = new ChatBox({
      users: users,
      messages: req.body.message,
    });
    await chatbox.save();
    return res.json({
      status: "success",
      chatbox: chatbox,
      msg: "chatbox created successfully",
    });
  }),
];
