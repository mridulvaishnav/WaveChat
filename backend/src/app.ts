import express from 'express';
import { clerkMiddleware } from '@clerk/express'

import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import e from 'express';
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

export default app;