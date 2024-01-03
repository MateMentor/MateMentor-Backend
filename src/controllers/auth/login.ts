/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/User";

const MAX_LOGIN_ATTEMPTS = 6;
const LOCK_TIME = 1 * 60 * 60 * 1000;

async function login(req: Request, res: Response): Promise<Response | void> {
        try {
                const { email, password } = req.body;

                const user = await User.findOne({ where: { email } });
                if (!user) {
                        return res.status(404).send("User not found");
                }

                const now = Date.now();

                if (user.lockUntil && user.lockUntil > now) {
                        return res
                                .status(403)
                                .send(
                                        "Account is temporarily locked due to multiple failed login attempts. Please try again later.",
                                );
                }
                const isValid = await bcrypt.compare(password, user.password);

                if (!isValid) {
                        user.loginAttempts += 1;
                        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                                user.lockUntil = now + LOCK_TIME;
                        }
                        await user.save();
                        return res.status(401).send("Invalid password");
                }

                user.loginAttempts = 0;
                user.lockUntil = 0;
                await user.save();

                const token = jwt.sign(
                        { id: user.id },
                        process.env.JWT_SECRET!,
                        { expiresIn: "8h" },
                );

                return res.status(200).send({
                        message: "Logged in successfully",
                        token: token,
                        user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                        },
                });
        } catch (err) {
                console.error(err);
                return res.status(500).send("An unexpected error occurred");
        }
}

export default login;
