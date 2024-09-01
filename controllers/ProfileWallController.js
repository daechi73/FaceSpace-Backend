const { json } = require("body-parser");
const ProfileWall = require("../models/ProfileWall");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.profileWall_get_all = asyncHandler(async (req, res, next) => {
  const profileWalls = await ProfileWall.find().exec();
  if (profileWalls.length === 0)
    return res.json({
      status: "failed",
      msg: "There are no profile walls to display",
    });
  return res.json({
    status: "success",
    msg: "Successfully returned profile walls",
    profileWalls: profileWalls,
  });
});

exports.profileWall_get_single_with_id = asyncHandler(
  async (req, res, next) => {
    const profileWall = await ProfileWall.findById(req.params.id).populate({
      path: "posts",
      model: "Post",
      populate: {
        path: "posted_user",
        select: "-password",
        model: "User",
      },
    });
    if (profileWall)
      return res.json({
        status: "Success",
        msg: "profileWall successfully returned",
        profileWall: profileWall,
      });
  }
);

exports.profileWall_create = [
  body("user").exists({ value: "falsy" }).withMessage("User info missing"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.findById(req.body.userId).exec();
    if (!errors.isEmpty()) {
      return res.json({
        status: "failed",
        msg: "User information missing",
        errors: errors.array(),
      });
    }
    if (user === null) {
      return res.json({
        status: "failed",
        msg: "couldn't find User",
      });
    }
    const profileWall = new ProfileWall({
      user: user,
      posts: [],
    });

    await profileWall.save();

    return res.json({
      status: "success",
      msg: "profile wall created",
    });
  }),
];

exports.profileWall_insert_post = asyncHandler(async (req, res, next) => {
  try {
    const profileWall = await ProfileWall.findById(req.body.profileWallId);
    if (profileWall === null) return console.log("profileWall doesn't exist");
    profileWall.posts.push(req.body.post);
    const newProfileWall = new ProfileWall({
      user: profileWall.user,
      posts: profileWall.posts,
    });
    const updatedProfileWall = await ProfileWall.findIdAndUpdate(
      profileWall._id,
      newProfileWall,
      { new: true }
    ).populate("posts");
    return res.json({
      status: "success",
      msg: "profileWall updated successfully",
      profileWall: updatedProfileWall,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.profileWall_delete_post = asyncHandler(async (req, res, next) => {
  const [profileWall] = await Promise.all([
    ProfileWall.findById(req.body.profileWall).populate("posts"),
  ]);

  if (profileWall === null) throw new Error("Profile Wall doessn't exist");

  const updatingProfileWall = new ProfileWall({
    user: profileWall.user,
    posts: profileWall.posts,
    _id: profileWall._id,
  });

  let deleted;
  for (let i = 0; i < updatingProfileWall.posts.length; i++) {
    if (updatingProfileWall.posts[i].id == req.body.postid) {
      //console.log(updatingProfileWall.posts[i]);
      deleted = true;
      updatingProfileWall.posts.splice(i, i);
      break;
    }
  }
  try {
    if (deleted) {
      const updatedProfileWall = await ProfileWall.findByIdAndUpdate(
        profileWall._id,
        updatingProfileWall,
        {
          new: true,
        }
      ).populate("posts");
      res.json({
        status: "Success",
        msg: "Post deleted from Profile Wall",
        updatedProfileWall: updatedProfileWall,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
