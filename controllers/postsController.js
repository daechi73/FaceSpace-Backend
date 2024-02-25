const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");

exports.posts_get_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().exec();
  if (posts.length !== 0) {
    return res.json({
      status: "success",
      posts: posts,
    });
  } else {
    return res.json({
      status: "failed",
      msg: "No posts available",
    });
  }
});

exports.posts_post_posts = [asyncHandler(async (req, res, next) => {})];
