import express from 'express';
import path from 'path';

import { clerkMiddleware } from '@clerk/express'

import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json()) //parses incoming JSON request bodies and makes them available as req.body in route handlers.

app.use(clerkMiddleware()) //Integrates Clerk's authentication middleware into the Express app, allowing you to access user authentication information in your route handlers.

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is healthy" });
});

app.use("/api/auth",authRoutes)
app.use("/api/chats",chatRoutes)
app.use("/api/messages",messageRoutes)
app.use("/api/users",userRoutes)

// error handlers must come after all routes and other middlewares do they can catch errors passed with next() or thrown in async route handlers
app.use(errorHandler)

//serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist")));

  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
  });
}

export default app;