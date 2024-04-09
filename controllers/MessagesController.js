const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.message_get_all = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().exec();

  if (messages.length === 0)
    return res.json({ status: "failed", msg: "No messages" });
  return res.json({
    status: "success",
    messages: messages,
    msg: "Retreiving all messages success",
  });
});

exports.message_create = [
  asyncHandler(async (req, res, next) => {
    const [sender, receiver] = await Promise.all([
      User.findById(req.body.sender).exec(),
      User.find({ user_name: req.body.receiver }),
    ]);
    if (sender === null || receiver[0] === null)
      res.json({ status: "failed", msg: "cant find one of the users" });
    const message = new Message({
      sender: sender,
      receiver: receiver,
      message: req.body.message,
    });
    await message.save();
    return res.json({
      status: "success",
      message: message,
      msg: "message created",
    });
  }),
];
