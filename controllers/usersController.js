const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Hash = require("../public/javascript/Hash.js");

exports.user_get_users = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();
  if (users) res.send(Object.values(users));
  else res.send("No users to show");
});

exports.user_sign_in = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
      console.log("here3");
      if (!user) {
        return res.json("Log in failed, try again");
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ status: "success", user: user });
      });
    })(req, res, next);
  }),
];

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
    await user.save();
    res.json({ status: "success", user: user });
  }),
];
