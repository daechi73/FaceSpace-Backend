const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

exports.posts_get_posts = asyncHandler(async (req, res, next) => {
  res.send("posts get working");
});
