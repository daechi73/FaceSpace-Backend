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
