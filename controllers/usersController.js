const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const FriendReq = require("../models/FriendRequest.js");
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
    .ne(req.body.user.user_name)
    .select("-password");
  if (users) res.json({ status: "success", users: users });
  else res.json({ status: "faliure" });
});
exports.user_get_user_detail_with_id = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("friends")
    .populate({
      path: "friend_requests",
      populate: [
        {
          path: "outbound",
          model: "User",
          select: "-password",
        },
        {
          path: "inbound",
          model: "User",
          select: "-password",
        },
      ],
    })
    .populate("posts");
  //console.log(user);
  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.json({ status: "success", user: user });
});
exports.user_get_user_detail_with_username = asyncHandler(
  async (req, res, next) => {
    const user = await User.find({ user_name: req.params.username })
      .select("-password")
      .populate("friends")
      .populate({
        path: "friend_requests",
        populate: [
          {
            path: "outbound",
            model: "User",
            select: "-password",
          },
          {
            path: "inbound",
            model: "User",
            select: "-password",
          },
        ],
      })
      .populate("posts");
    if (user.length === 0)
      return res.json({ status: "failed", msg: "user not found" });
    res.json({ status: "success", user: user[0] });
  }
);
exports.user_sign_in = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", async (err, user, options) => {
      if (!user) {
        return res.json("Log in failed, try again");
      }
      req.login(user, async (err) => {
        if (err) return next(err);
        const userData = await User.findById(req.user._id)
          .select("-password")
          .populate("friends")
          .populate({
            path: "friend_requests",
            populate: [
              {
                path: "outbound",
                model: "User",
                select: "-password",
              },
              {
                path: "inbound",
                model: "User",
                select: "-password",
              },
            ],
          })
          .populate("posts");
        console.log(userData);

        return res.json({
          status: "success",
          user: userData,
        });
      });
    })(req, res, next);
  }),
];
exports.user_resign_in = [
  asyncHandler(async (req, res, next) => {
    console.log(req);
    if (req.user) return res.json("signedIn");
    return res.json("not signed in");
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

exports.user_update = [
  (req, res, next) => {
    if (!(req.body.friends instanceof Array)) {
      if (typeof req.body.friends === "undefined") req.body.friends = [];
      else req.body.friends = new Array(req.body.friends);
    }
    next();
  },
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
  body("friends").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: "failed", errors: errors.array() });
    }
    const newUser = new User({
      user_name: req.body.username,
      password: req.body.password,
    });
  }),
];
exports.user_update_add_friendRequest = asyncHandler(async (req, res, next) => {
  let [signedInUser, toAddUser] = await Promise.all([
    User.findById(req.params.id).populate("friend_requests").exec(),
    User.findById(req.body.toAddUserId).exec(),
  ]);

  //console.log(signedInUser);
  // const checkUserAlreadyAdded = () => {
  //   for (let i = 0; i < signedInUser.friend_requests.length; i++) {
  //     // if (
  //     //   signedInUser.friend_requests[i].inbound === req.body.toAddUserId ||
  //     //   signedInUser.friend_requests[i].outbound === req.body.toAddUserId
  //     // ) {
  //     //   console.log(signedInUser.friend_requests[i].inbound);
  //     //   return true;
  //     // }
  //   }
  //   console.log(signedInUser.friend_requests[0].inbound === toAddUser._id);
  //   console.log(toAddUser._id);
  //   console.log(signedInUser.friend_requests[0].inbound);
  //   //return false;
  // };
  // checkUserAlreadyAdded();
  // if (checkUserAlreadyAdded())
  //   return res.json({ status: "failure", msg: "user already added" });
  if (!toAddUser) return res.json("added user is not found in database");

  const friendRequest = new FriendReq({
    outbound: signedInUser,
    inbound: toAddUser,
  });
  signedInUser.friend_requests.push(friendRequest);
  toAddUser.friend_requests.push(friendRequest);
  await Promise.all([
    friendRequest.save(),
    signedInUser.save(),
    toAddUser.save(),
  ]);
  [signedInUser, toAddUser] = await Promise.all([
    User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "friend_requests",
        populate: [
          {
            path: "outbound",
            model: "User",
            select: "-password",
          },
          {
            path: "inbound",
            model: "User",
            select: "-password",
          },
        ],
      })
      .populate("friends")
      .populate("posts")
      .exec(),
    User.findById(req.body.toAddUserId).exec(),
  ]);
  // console.log(signedInUser);
  // console.log(toAddUser);
  return res.json({
    status: "success",
    user: signedInUser,
  });
});

exports.user_update_add_friend = asyncHandler(async (req, res, next) => {
  //console.log(req.body.friendReq);
  const [signedInUser, otherUser] = await Promise.all([
    User.findById(req.params.id)
      .where("friends")
      .ne(req.body.friendReq.outbound)
      .populate("friend_requests")
      .exec(),
    User.findById(req.body.friendReq.outbound).populate("friend_requests"),
  ]);
  if (signedInUser === null) {
    return res.json({
      status: "failed",
      msg: "User Already added as friend",
    });
  }
  if (otherUser === null) {
    return res.json({
      status: "failed",
      msg: `User ${req.body.friendReq.outbound.user_name} is not in the database`,
    });
  }
  signedInUser.friends.push(otherUser);
  otherUser.friends.push(signedInUser);

  //removes friendreq from signedInUser
  for (let i = 0; i < signedInUser.friend_requests.length; i++) {
    if (signedInUser.friend_requests[i].id === req.body.friendReq._id) {
      signedInUser.friend_requests.splice(i, 1);
      console.log(
        `Friend Req ${req.body.friendReq._id} erased from signedInUser`
      );
    }
  }
  //removes friendReq from otherUser
  for (let i = 0; i < otherUser.friend_requests.length; i++) {
    if (otherUser.friend_requests[i].id === req.body.friendReq._id) {
      otherUser.friend_requests.splice(i, 1);
      console.log(
        `Friend Req ${req.body.friendReq._id} erased from other User`
      );
    }
  }

  await Promise.all([signedInUser.save(), otherUser.save()]);
  const updatedSignedInUser = await User.findById(req.params.id)
    .populate({
      path: "friend_requests",
      populate: [
        {
          path: "outbound",
          model: "User",
          select: "-password",
        },
        {
          path: "inbound",
          model: "User",
          select: "-password",
        },
      ],
    })
    .populate("friends")
    .populate("posts")
    .select("-password");
  res.json({ status: "success", user: updatedSignedInUser });
});

exports.user_update_decline_friendReq = asyncHandler(async (req, res, next) => {
  const [signedInUser, otherUser] = await Promise.all([
    User.findById(req.params.id)
      .where("friends")
      .ne(req.body.friendReq.outbound)
      .populate("friend_requests")
      .exec(),
    User.findById(req.body.friendReq.outbound).populate("friend_requests"),
  ]);
  //removes friendreq from signedInUser
  for (let i = 0; i < signedInUser.friend_requests.length; i++) {
    if (signedInUser.friend_requests[i].id === req.body.friendReq._id) {
      signedInUser.friend_requests.splice(i, 1);
      console.log(
        `Friend Req ${req.body.friendReq._id} erased from signedInUser`
      );
    }
  }
  //removes friendReq from otherUser
  for (let i = 0; i < otherUser.friend_requests.length; i++) {
    if (otherUser.friend_requests[i].id === req.body.friendReq._id) {
      otherUser.friend_requests.splice(i, 1);
      console.log(
        `Friend Req ${req.body.friendReq._id} erased from other User`
      );
    }
  }
  await Promise.all([signedInUser.save(), otherUser.save()]);
  const updatedSignedInUser = await User.findById(req.params.id)
    .populate({
      path: "friend_requests",
      populate: [
        {
          path: "outbound",
          model: "User",
          select: "-password",
        },
        {
          path: "inbound",
          model: "User",
          select: "-password",
        },
      ],
    })
    .populate("friends")
    .populate("posts")
    .select("-password");
  res.json({ status: "success", user: updatedSignedInUser });
});

exports.user_update_add_chatbox = asyncHandler(async (req, res, next) => {
  const [sender, receiver] = await Promise.all([
    User.findById(req.params.id).exec(),
    User.findById(req.body.chatbox.receiver).exec(),
  ]);
  if (sender === null || receiver === null)
    return res.json({ status: "failure" });
  const newSender = new User({
    ...sender,
    chat: sender.chat.push(req.body.chatbox),
    _id: sender._id,
  });
  const newReceiver = new User({
    ...receiver,
    chat: sender.chat.push(req.body.chatbox),
    _id: receiver._id,
  });
  //await Promise.all([newSender.save(), newReceiver.save()]);

  return res.json({
    status: "success",
    newSignedInUser: newSender,
    msg: "message sent successfully",
  });
});
