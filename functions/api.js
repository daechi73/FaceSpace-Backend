var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const serverless = require("serverless-http");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const MongoStore = require("connect-mongo");

var indexRouter = require("../routes/index");
var usersRouter = require("../routes/users");
const postsRouter = require("../routes/posts");
const commentsRouter = require("../routes/comments");
const friendRequestRouter = require("../routes/friendRequests.js");
const messageRouter = require("../routes/messages.js");
const chatboxesRouter = require("../routes/chatboxes.js");
const profileWallRouter = require("../routes/profileWall.js");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const mongodb = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.o5wrez4.mongodb.net/faceSpace?retryWrites=true&w=majority`;
//`mongodb+srv://<username>:<password>@cluster0.o5wrez4.mongodb.net/?retryWrites=true&w=majority`;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongodb);
}
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect

  // //production mode
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://facespace1.netlify.app"
  );
  //dev mode
  //res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Access-Control-Allow-Origin,Accept,Cache"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Pass to next layer of middleware
  next();
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ user_name: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      //const match = user.password === password;
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("here in serializeUser");
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(
  session({
    secret: "faceSpceSecretCats",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.o5wrez4.mongodb.net/faceSpace?retryWrites=true&w=majority`,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      rolling: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
    },
  })
);

//https://daechi73.github.io
app.use(passport.initialize());
app.use(passport.session());

// socket.io handlers
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
// });

// io.on("connection", (socket) => {
//   console.log(`a user connected ${socket.id}`);
//   socket.emit("testing", "working?");
//   socket.on("send_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });

// save server and io to app
// app.set("customServer", server);
// app.set("socketio", io);

//routing
app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/friendRequests", friendRequestRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chatboxes", chatboxesRouter);
app.use("/api/profileWalls", profileWallRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
