const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("<p>ws test server is on.</p>");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("connection on");
  socket.on("msg", (data) => {
    io.emit("msg", data);
  });
});

server.listen(4111, () => {
  console.log("[App] listening on *:3111");
});
