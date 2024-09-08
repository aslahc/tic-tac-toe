// Import the required modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const gameEvents = require("./gameEvents");
// Initialize the Express application
const app = express();
// Use CORS middleware to allow cross-origin requests

app.use(cors());

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server and set CORS options to allow all origins
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Set up a connection event listener to handle new socket connections
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // Handle game-related events
  gameEvents(socket, io);
});

// Set up a connection event listener to handle new socket connections

server.listen(4000, () => {
  console.log("Server running on port 4000");
});
