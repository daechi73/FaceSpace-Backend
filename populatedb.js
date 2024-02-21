#! /user/bin/env node

console.log("This SCript populates users and comments to the database");

const userArgs = process.argv.slice(2);
//mongodb+srv://<username>:<password>@cluster0.o5wrez4.mongodb.net/faceSpace?retryWrites=true&w=majority

const bcrypt = require("bcryptjs");
const User = require("./models/User");

const comments = [];
const users = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  //await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}
async function userCreate(
  index,
  name,
  user_name,
  password,
  email,
  bio,
  friends,
  friend_requests,
  posts
) {
  const user = new User({
    user_name: user_name,
    name,
    password: await hashedPass2(password),
    email: email,
    bio: bio,
    friends: friends,
    friend_requests: friend_requests,
    posts: posts,
  });

  await user.save();
  users[index] = user;
  console.log(`added user: ${user.name} ${user.user_name}`);
}
async function commentCreate(index, user, date_added, comment) {
  const commentObj = new Comment({
    user: user,
    date_added: date_added,
    comment: comment,
  });
  await commentObj.save();
  comments[index] = commentObj;
  console.log(`added comment from ${user.user_name}`);
}

async function hashedPass2(password) {
  const result = await bcrypt.hash(password, 10);
  return result;
}

async function createUsers() {
  console.log("adding Users");
  await Promise.all([
    userCreate(
      0,
      "daechi73",
      "J",
      "98527852",
      "daechi73@daechi73.com",
      "Hi I'm J!"
    ),
  ]);
}

// async function createComments() {
//     console.log("creating Comments..");
//     console.log(users);
//     await Promise.all([
//       commentCreate(0, users[0], "1992-04-12", "Th1$ iS $o MucH FuN!"),
//     ]);
//   }
