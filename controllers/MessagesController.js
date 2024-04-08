const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.message_get_all = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().exec();

  if (messages.length === 0)
    return res.json({ status: "failed", msg: "No messages" });
  return res.json({ status: "success", messages: messages });
});
