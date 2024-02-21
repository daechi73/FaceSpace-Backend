const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { body, validationResult } = require("express-async-handler");
const Hash = require("../public/javascript/Hash.js");

exports.user_get_users = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();
  if (users) res.send(Object.values(users));
  else res.send("No users to show");
});

exports.user_sign_in = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
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
