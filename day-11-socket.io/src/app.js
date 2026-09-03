import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("New Connection is Created");

  socket.on("message", (msg) => {
    console.log(msg);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
