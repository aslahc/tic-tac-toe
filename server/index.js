const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const gameEvents = require("./gameEvents");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Frontend URL
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // Handle game-related events
  gameEvents(socket, io);
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
