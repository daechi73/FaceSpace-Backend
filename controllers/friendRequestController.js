const FriendReq = require("../models/FriendRequest");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.friendRequest_listAll = asyncHandler(async (req, res, next) => {
  const friendReq = await FriendReq.find().exec();
  if (friendReq.length === 0) return res.json("Friend Request empty");
  return res.json(friendReq);
});

exports.friendRequest_delete = asyncHandler(async (req, res, next) => {
  const [fR, fRCopies] = await Promise.all([
    FriendReq.findById(req.params.id).exec(),
    User.find({ friend_requests: req.params.id }).exec(),
  ]);

  if (fRCopies.length !== 0) {
    return res.json({
      status: "failed",
      msg: "delete this friend request's instances",
    });
  }
  await FriendReq.findByIdAndDelete(req.params.id);
  res.json({ status: "success", msg: "Friend request deleted" });
});
