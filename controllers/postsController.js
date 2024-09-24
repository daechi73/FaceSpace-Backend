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

exports.posts_get_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();
  if (post === null) return console.log("post not found");
  return res.json({
    status: "Success",
    msg: "Post returned successfully",
    post: post,
  });
});

exports.posts_get_user_posts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ posted_user: req.params.id })
    .populate({ path: "posted_user", select: "-password" })
    .populate("likes")
    .populate("comments");

  if (posts.length === 0) console.log("post not found");
  return res.json({
    status: "Success",
    msg: "User's posts returned successfully",
    posts: posts,
  });
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

    try {
      const [profileWall] = await Promise.all([
        ProfileWall.findById(req.body.profileWall),
      ]);

      if (profileWall === null)
        return console.log(
          "Given profileWall not found in posts_post_posts_profileWall"
        );
      const post = new Post({
        posted_user: req.body.user,
        post_content: req.body.post,
      });
      const newProfileWall = new ProfileWall({
        _id: profileWall._id,
        user: profileWall.user,
        posts: profileWall.posts,
      });

      newProfileWall.posts.push(post);

      await post.save();
      const updatedProfileWall = await ProfileWall.findByIdAndUpdate(
        profileWall._id,
        newProfileWall,
        { new: true }
      ).populate({
        path: "posts",
        model: "Post",
        populate: {
          path: "posted_user",
          model: "User",
          select: "-password",
        },
      });
      return res.json({
        status: "success",
        msg: "Post Successfully added",
        profileWall: updatedProfileWall,
      });
    } catch (error) {
      console.log(error);
    }
  }),
];

exports.posts_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const [post, user] = await Promise.all([
      Post.findById(req.params.id).populate("posted_user"),
      User.findById(req.body.signedInUserId).exec(),
    ]);
    if (post === null) return console.log("post not found");
    if (user === null) return console.log("user not found");

    if (post.posted_user.id === user.id) {
      await Post.findByIdAndDelete(req.params.id);
      return res.json({
        status: "Success",
        msg: "Post Removed Successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
