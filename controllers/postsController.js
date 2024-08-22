const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const ProfileWall = require("../models/ProfileWall");
const { body, validationResult } = require("express-validator");

exports.posts_get_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate({
    path: "posted_user",
    select: "-password",
  });
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

exports.posts_post_posts_main = [
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

    await post.save();
    return res.json({ status: "success", msg: "Post successfully added" });
  }),
];

exports.posts_post_posts_profileWall = [
  body("post")
    .exists({ values: "falsy" })
    .withMessage("You must have some input to submit a post"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        status: "failed",
        msg: "error/s occured in the request",
        errors: errors.array(),
      });
    }

    const [profileWall] = await Promise.all([
      ProfileWall.findbyId(req.body.user.profileWall).populate("posts"),
    ]);

    if (profileWall === null)
      return console.log(
        "Given User not found in posts_post_posts_profileWall"
      );
    const post = new Post({
      posted_user: req.body.user,
      post_content: req.body.post,
    });
    profileWall.push(post);
    await Promise.all([post.save(), profileWall.save()]);
    return res.json({ status: "success", msg: "Post Successfully added" });
  }),
];
