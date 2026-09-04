import { Socket } from "dgram";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {});

io.on("connection", (Socket) => {
  //

  console.log("new user connected to Server");

  //

  Socket.on("message", (msg) => {
    console.log(msg);
    console.log(Socket.id);

    //this will send message to current user that you data is recived
    Socket.emit("message", "Your data is Recived at Server");

    //sending mesasage to all conccted user
    io.emit("message", msg);

    //this will send message to all user except sender
    Socket.broadcast.emit("message", msg);
  });
});

// const httpServer = createServer(app);

// const io = new Server(httpServer, {});

// io.on("connection", (socket) => {
//   console.log("New Connection is Created");

//   socket.on("message", (msg) => {
//     console.log(msg);
//     console.log(socket.id);

//     //this will send reply to user your message recived
//     socket.emit("message", " socket.emit()  Your Message Recived to Server");

//     //this will send reply to all users
//     io.emit("message", msg);

//     socket.broadcast.emit("message", msg);
//   });
// });

httpServer.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
