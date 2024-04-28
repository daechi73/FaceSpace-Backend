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
      users: { $all: [req.body.message.sender, req.body.message.receiver] },
    });
    console.log("existing chatbox");
    console.log(existingChatbox);

    if (existingChatbox.length !== 0) {
      const updatedMessages = existingChatbox[0].messages;

      updatedMessages.push(req.body.message);

      const chatbox = new ChatBox({
        _id: existingChatbox[0]._id,
        users: existingChatbox[0].users,
        messages: updatedMessages,
      });
      //Old alternaive
      //
      // // existingChatbox[0].messages.push(req.body.message);
      // // await existingChatbox[0].save();
      const updatedChatbox = await ChatBox.findByIdAndUpdate(
        existingChatbox[0]._id,
        chatbox,
        {}
      
        .populate({
          path: "messages",
          model: "Message",
          populate: [
            {
              path: "sender",
              model: "User",
              select: "-password",
            },
            {
              path: "receiver",
              model: "User",
              select: "-password",
            },
          ],
        })
        .populate({ path: "users", model: "User", select: "-password" });
      return res.json({
        status: "success",
        msg: "added messages to chatbox",
        chatbox: updatedChatbox,
        method: "added",
      });
    }

    const users = [req.body.message.sender, req.body.message.receiver];
    //console.log(users);
    const chatbox = new ChatBox({
      users: users,
      messages: req.body.message,
    });
    console.log(chatbox);
    await chatbox.save();
    return res.json({
      status: "success",
      chatbox: chatbox,
      msg: "chatbox created successfully",
      method: "created",
    });
  }),
];
