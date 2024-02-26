const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");

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

exports.posts_post_posts = [
  body("post")
    .exists({ values: "falsy" })
    .withMessage("You must have some input to submit a post"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: "failure",
        msg: "You must have some input to submit a post",
      });
    }
    const post = new Post({
      posted_user: req.body.user,
      post_content: req.body.post,
    });
    console.log(post);
    await post.save();
    res.json({ status: "success", msg: "Post successfully added" });
  }),
];
