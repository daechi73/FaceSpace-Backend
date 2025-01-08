const app = require("../js/shareJs");
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
  methods: ["GET", "POST"],
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} has Connected`);
  socket.emit("testing", "working?");
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
  socket.on("disconnect", (reson) => {
    console.log(`User ${socket.id} has disconnected`);
  });
});

app.set("customServer", server);
app.set("socketio", io);
