const Friend = require("../models/FriendRequest");
const asyncHandler = require("express-async-handler");

exports.friendRequest_listAll = asyncHandler(async (req, res, next) => {
  res.json("working");
});
