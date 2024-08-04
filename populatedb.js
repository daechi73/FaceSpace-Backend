#! /user/bin/env node

console.log("This SCript populates users and comments to the database");

const userArgs = process.argv.slice(2);
//mongodb+srv://<username>:<password>@cluster0.o5wrez4.mongodb.net/faceSpace?retryWrites=true&w=majority

const bcrypt = require("bcryptjs");
const User = require("./models/User");
const ProfileWall = require("./models/ProfileWall");

const comments = [];
const users = [];
const profileWalls = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  // await createProfileWall();
  //await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}
async function userCreate(
  index,
  user_name,
  name,
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
  });

  const profileWall = new ProfileWall({
    user: user,
    posts: [],
  });
  user.profileWall = profileWall;

  await Promise.all([user.save(), profileWall.save()]);
  users[index] = user;
  console.log(`added user: ${user.name} ${user.user_name}`);
}

// async function profileWallCreate(index, user) {
//   const profileWall = new ProfileWall({
//     user: user,
//     posts: [],
//   });

//   await profileWall.save();
//   profileWalls[index] = profileWall;
//   console.log(`added: ${profileWall.user.name}'s profileWall`);
// }
// async function commentCreate(index, user, date_added, comment) {
//   const commentObj = new Comment({
//     user: user,
//     date_added: date_added,
//     comment: comment,
//   });
//   await commentObj.save();
//   comments[index] = commentObj;
//   console.log(`added comment from ${user.user_name}`);
// }

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
      "daechi73@gmail.com",
      "Hi I'm J!"
    ),
    userCreate(
      1,
      "newUser",
      "J",
      "98527852",
      "newUser@gmail.com",
      "Hi I'm newUser!"
    ),
    userCreate(
      2,
      "newUser2",
      "J",
      "98527852",
      "newUser2@gmail.com",
      "Hi I'm newUser2!"
    ),
    userCreate(
      3,
      "newUser3",
      "J",
      "98527852",
      "newUser3@gmail.com",
      "Hi I'm newUser!"
    ),
  ]);
}

// async function createProfileWall() {
//   console.log("adding ProfileWalls");

//   await Promise.all([
//     profileWallCreate(0, users[0]),
//     profileWallCreate(1, users[1]),
//     profileWallCreate(2, users[2]),
//     profileWallCreate(3, users[3]),
//   ]);
// }

// async function createComments() {
//     console.log("creating Comments..");
//     console.log(users);
//     await Promise.all([
//       commentCreate(0, users[0], "1992-04-12", "Th1$ iS $o MucH FuN!"),
//     ]);
//   }
