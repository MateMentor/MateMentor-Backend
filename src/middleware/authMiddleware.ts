/** @format */

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
        req: Request,
        res: Response,
        next: NextFunction,
) => {
        try {
                const tokenHeader = req.headers.authorization;
                if (!tokenHeader) {
                        return res
                                .status(401)
                                .send(`Access denied. No token provided.`);
                }
                const token = tokenHeader.split(" ")[1];

                const decoded = jwt.verify(token, process.env.JWT_SECRET!);

                req.user = decoded;

                next();
        } catch (error) {
                res.status(400).send("invalid token");
        }
};
