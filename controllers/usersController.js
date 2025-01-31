const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const FriendReq = require("../models/FriendRequest.js");
const ProfileWall = require("../models/ProfileWall.js");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const Hash = require("../public/javascript/Hash.js");

exports.user_checkPersist = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const newUser = req.user.toObject();
    delete newUser.password;
    delete newUser.friends;
    console.log(req.session);
    return res.json({ persist: true, user: newUser });
  }
  return res.json({ persist: false });
});
exports.user_get_sessions = asyncHandler(async (req, res, next) => {
  res.json({
    session: req.session,
    sessionStore: req.sessionStore,
  });
});
exports.user_get_users = asyncHandler(async (req, res, next) => {
  const users = await User.find()
    .select("-password")
    .populate({ path: "friends", select: "-password" })
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
    .populate({
      path: "chatbox",
      populate: [
        {
          path: "users",
          model: "User",
          select: "user_name",
        },
      ],
    });
  if (users.length !== 0)
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
    .populate({ path: "friends", select: "-password" })
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
    .populate({
      path: "chatbox",
      populate: [
        {
          path: "users",
          model: "User",
          select: "user_name",
        },
      ],
    });
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
      .populate({ path: "friends", select: "-password" })
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
      .populate("profileWall")
      .populate({
        path: "chatbox",
        populate: [
          {
            path: "users",
            model: "User",
            select: "user_name",
          },
        ],
      });
    if (user.length === 0)
      return res.json({ status: "failed", msg: "user not found" });
    res.json({ status: "success", user: user[0] });
  }
);
exports.user_get_chatbox = asyncHandler(async (req, res, next) => {
  const [signedInUser, otherUser] = await Promise.all([
    User.findById(req.params.id)
      .populate({
        path: "chatbox",
        populate: [
          {
            path: "messages",
            model: "Message",
          },
        ],
      })
      .exec(),
    User.find({ user_name: req.params.otherUsername }),
  ]);

  if (signedInUser === null) return res.json("signedInUSer not found");
  if (otherUser[0] === null) return res.json("otherUser not found");

  if (signedInUser.chatbox.length === 0)
    return res.json({ status: "failed", msg: "You have no active chatbox" });
  for (let i = 0; i < signedInUser.chatbox.length; i++) {
    for (let j = 0; j < signedInUser.chatbox[i].users.length; j++) {
      const userIdString = JSON.stringify(signedInUser.chatbox[i].users[j]);
      const otherUserIdString = JSON.stringify(otherUser[0].id);
      if (userIdString === otherUserIdString) {
        return res.json({
          status: "success",
          msg: "Chatbox Found",
          chatbox: signedInUser.chatbox[i],
        });
      }
    }
  }
  return res.json({
    status: "failed",
    msg: "chatbox not found",
  });
});
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
          .populate({ path: "friends", select: "-password" })
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
          .populate("profileWall");

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
    if (req.user) {
      // const updatedUser = req.user.toObject();
      // delete updatedUser.password;
      // console.log(updatedUser);
      const user = await User.findById(req.user.id)
        .select("-password")
        .populate({ path: "friends", select: "-password" })
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
        .populate({
          path: "chatbox",
          populate: [
            {
              path: "users",
              model: "User",
              select: "user_name",
            },
          ],
        });
      return res.status(200).json({
        status: "success",
        user: user,
        msg: "Auto Resign-In Success",
      });
    }
    return res.status(400).json({ msg: "No previous session", status: "fail" });
  }),
];
exports.user_sign_out = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) return next(err);
    });
    res.clearCookie("connect.sid");
    res.json({ status: "success", msg: "Log out success" });
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
    .withMessage("Username must be less than 30 letters")
    .custom(async (username) => {
      const userCheck = User.find({ user_name: username });
      if (userCheck) throw new Error("Username already exists");
    }),
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
    .withMessage("email must be less than 40 letters")
    .custom(async (email) => {
      const user = await User.find({ email: email });
      if (user.length !== 0) throw new Error("Email already in use.");
    }),
  body("bio")
    .trim()
    .isLength({ max: 400 })
    .withMessage("Password must be less than 50 letters"),
  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log("errrrrror");
        return res.json({
          status: "failed",
          user: {
            user_name: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
            bio: req.body.bio,
          },
          errors: errors.array(),
        });
      }

      const user = new User({
        user_name: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
      });
      const profileWall = new ProfileWall({
        user: user,
        posts: [],
      });
      user.profileWall = profileWall;

      user.password = await Hash(user.password);

      await user.save();
      await profileWall.save();
      console.log(user);
      const updatedUser = await User.findById(user._id).exec();
      res.json({ status: "success", user: updatedUser });
    } catch (error) {
      console.log(error);
    }
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
      .populate({ path: "friends", select: "-password" })
      .populate("profileWall")
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
    .populate({ path: "friends", select: "-password" })
    .populate("profileWall")
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
    .populate({ path: "friends", select: "-password" })
    .populate("profileWall")
    .select("-password");
  res.json({ status: "success", user: updatedSignedInUser });
});

exports.user_update_add_chatbox = asyncHandler(async (req, res, next) => {
  const [sender, receiver] = await Promise.all([
    User.findById(req.params.id).exec(),
    User.findById(req.body.chatbox.users[1]).exec(),
  ]);

  if (sender === null || receiver === null)
    return res.json({ status: "failure" });

  let newChat = sender.chatbox;
  newChat.push(req.body.chatbox);
  const newSender = new User({
    _id: sender._id,
    user_name: sender.user_name,
    password: sender.password,
    name: sender.name,
    email: sender.email,
    bio: sender.bio,
    friends: sender.friends,
    friend_requests: sender.friend_requests,
    posts: sender.posts,
    chatbox: newChat,
  });

  newChat = receiver.chatbox;
  newChat.push(req.body.chatbox);
  const newReceiver = new User({
    _id: receiver._id,
    user_name: receiver.user_name,
    password: receiver.password,
    name: receiver.name,
    email: receiver.email,
    bio: receiver.bio,
    friends: receiver.friends,
    friend_requests: receiver.friend_requests,
    posts: receiver.posts,
    chatbox: newChat,
  });
  console.log(newSender);
  //await Promise.all([newSender.save(), newReceiver.save()]);
  const updatedUser = await User.findByIdAndUpdate(sender._id, newSender, {
    new: true,
  });
  await User.findByIdAndUpdate(receiver.id, newReceiver, {});
  console.log(updatedUser);
  return res.json({
    status: "success",
    user: updatedUser,
    chatbox: req.body.chatbox,
    msg: "message sent successfully",
  });
});
