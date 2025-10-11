import express from "express";
import { createServer } from "http";
import { Server, type Socket } from "socket.io";
import { Types } from "mongoose";

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer);

interface message {
  content: string;
  receiverId: Types.ObjectId;
  type: "user" | "group";
}

// mapping userId to SocketId
const toSocketId: Record<string, string> = {};

export const getSocketId = (userId: Types.ObjectId) => {
  return toSocketId[userId.toString()];
};

// middleware checks user id
io.use((socket: Socket, next: (err?: Error) => void) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error("Missing userId"));
  }
  socket.data.userId = userId;
  next();
});

io.on("connection", (socket: Socket) => {
  // mapping userId to socketId
  const senderId = socket.data.userId;
  toSocketId[senderId] = socket.id;

  socket.on("chat", (message: message, cb?: (data: string) => void) => {
    const receiverId = message.receiverId.toString();
    const type = message.type;

    // always send back to sender
    socket.emit("sender", message.content);

    if (type === "user") {
      const isReceiverActive = toSocketId.hasOwnProperty(receiverId);

      // send a message who is online
      if (isReceiverActive) {
        socket.to(toSocketId[receiverId]!).emit("receiver", message.content);
        cb && cb("Delivered");
      } else {
        cb && cb("Sent");
      }
    }

    if (type === "group") {
      socket.join(receiverId);
      console.log(`UserId: ${senderId} joined group: ${receiverId}`);

      socket.broadcast.to(receiverId).emit("receiver", message.content);
      cb && cb("Delivered");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client [${socket.id}] disconnected, reason: ${reason}`);
    // Remove user from mapping when disconnected
    delete toSocketId[senderId];
  });
});
