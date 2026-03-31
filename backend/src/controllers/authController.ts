import type { AuthRequest } from "../middleware/auth";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next:NextFunction) {
    try {
        const userId = req.userId;

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
        // Proceed to fetch user details or perform other operations
    } catch (error) {
        res.status(500)
        next();
    }
}

export async function authCallback(req: Request, res: Response, next:NextFunction) {
    try {
        const auth = getAuth(req);
        const clerkId = (auth && typeof auth === 'object' && 'userId' in auth) ? (auth as any).userId : undefined;
        if (!clerkId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let user = await User.findOne({ clerkId });
        if (!user) {
            // get user info from clerk and save to db
            const clerkUser = await clerkClient.users.getUser(clerkId);

            user = await User.create({
                clerkId,
                name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim() : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
                email: clerkUser.emailAddresses[0]?.emailAddress,
                avatar: clerkUser.imageUrl
            });
        }

        res.json({ user });
    } catch (error) {
        res.status(500);
        next(error);
    }
}