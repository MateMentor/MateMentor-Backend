/** @format */

// Import necessary modules and models
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../database/models/User";

async function login(req: Request, res: Response): Promise<Response | void> {
        try {
                const { email, password } = req.body;

                const user = await User.findOne({ where: { email } });
                if (!user) {
                        return res.status(404).send("User not found");
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) {
                        return res.status(401).send("Invalid password");
                }

                const token = jwt.sign(
                        { id: user.id },
                        process.env.JWT_SECRET!,
                        { expiresIn: "8h" },
                );

                return res.status(200).send({
                        message: "Logged in successfully",
                        token,
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
