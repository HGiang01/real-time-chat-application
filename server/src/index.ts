import express from "express";
import dotenv from "dotenv";

import { app, httpServer } from "./config/socket.js";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import conn from "./config/db.js";
import { sessionMiddleware } from "./middlewares/session.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Configs
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(sessionMiddleware());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// Middleware for error handler
app.use(errorHandler);

// Connect DB
const isConnectDB = await conn();

// Start server
if (isConnectDB) {
  httpServer.listen(PORT, () => {
    console.log(`Server is listening in PORT: ${PORT}`);
  });
}
