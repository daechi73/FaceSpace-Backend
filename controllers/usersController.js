const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { body, validationResult } = require("express-async-handler");
const Hash = require("../public/javascript/Hash.js");

exports.user_get_users = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();
  if (users) res.send(Object.values(users));
  else res.send("No users to show");
});

exports.user_signIn_post = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
      if (!user) {
        res.render("sign-in-get", {
          title: "Sign-in",
          errors: options.message,
        });
      } //else next();
      else {
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.json("");
        });
      }
    })(req, res, next);
  }),
];
