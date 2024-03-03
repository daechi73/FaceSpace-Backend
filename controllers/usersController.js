const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Hash = require("../public/javascript/Hash.js");

exports.user_get_users = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();
  if (users)
    res.json({
      status: "success",
      users: users,
    });
  else res.json("No users to show");
});
exports.user_get_other_users = asyncHandler(async (req, res, next) => {
  const users = await User.find()
    .where("user_name")
    .ne(req.body.user.user_name);
  if (users) res.json({ status: "success", users: users });
  else res.json({ status: "faliure" });
});
exports.user_get_user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("friends")
    .populate("friend_requests")
    .populate("posts");
  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.json({ status: "success", user: user });
});
exports.user_sign_in = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
      if (!user) {
        return res.json("Log in failed, try again");
      }
      req.login(user, (err) => {
        if (err) return next(err);
        console.log(req.user);
        return res.json({
          status: "success",
          user: { ...user._doc, password: "*********" },
        });
      });
    })(req, res, next);
  }),
];
exports.user_sign_out = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ status: "success", user: req.user });
  });
});
exports.user_sign_up = [
  body("username")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter a username")
    .isLength({ min: 4 })
    .withMessage("Username must be longer than 4 letters")
    .isLength({ max: 30 })
    .withMessage("Username must be less than 30 letters"),
  body("password")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter a password")
    .isLength({ min: 8 })
    .withMessage("Password must be longer than 8 letters")
    .isLength({ max: 100 })
    .withMessage("Password must be less than 50 letters"),
  body("name")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter a name")
    .isLength({ max: 30 })
    .withMessage("name must be less than 30 letters"),
  body("email")
    .trim()
    .exists({ values: "falsy" })
    .withMessage("You must enter an email")
    .isEmail()
    .withMessage("Must input a valid email address")
    .isLength({ max: 40 })
    .withMessage("email must be less than 40 letters"),
  body("bio")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Password must be less than 50 letters"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      user_name: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
    });
    if (!errors.isEmpty()) {
      return res.json({
        status: "failed",
        user: user,
        errors: errors.array(),
      });
    }
    user.password = await Hash(user.password);
    await user.save();
    res.json({ status: "success", user: user });
  }),
];
