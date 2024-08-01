const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

exports.posts_get_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("posted_user");
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
    const postedUser = await User.findById(req.body.user.id);
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
    postedUser.posts.push(post);
    console.log(postedUser);
    await Promise.all([post.save(), postedUser.save()]);
    return res.json({ status: "success", msg: "Post successfully added" });
  }),
];
