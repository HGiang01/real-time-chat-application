import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import conn from "./config/db.js";
import { sessionMiddleware } from "./middlewares/session.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Initial app
const app = express();

// Configs
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(sessionMiddleware());

// Routes
app.use("/api/auth", authRouter);
// app.use('/api/chat', )

// Middleware for error handler
app.use(errorHandler);

// Connect DB
const isConnectDB = await conn(); 

// Start server
isConnectDB && app.listen(PORT, (error) => {
  error && console.log(error.message);
  console.log(`Server is listening in PORT: ${PORT}`);
});
