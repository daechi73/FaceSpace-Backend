const FriendReq = require("../models/FriendRequest");
const asyncHandler = require("express-async-handler");

exports.friendRequest_listAll = asyncHandler(async (req, res, next) => {
  const friendReq = await FriendReq.find().exec();
  if (friendReq.length === 0) return res.json("Friend Request empty");
  return res.json(friendReq);
});
