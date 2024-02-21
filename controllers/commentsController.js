const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");

exports.comment_get_comments = asyncHandler(async (req, res, next) => {
  res.send("comments get working");
});
