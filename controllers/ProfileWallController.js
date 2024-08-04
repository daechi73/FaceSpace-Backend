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
