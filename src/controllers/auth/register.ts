/** @format */

import { Op } from "sequelize";

import User from "../../database/models/User";
import Joi from "joi";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { Error } from "sequelize";

// Validation Schema

const registerSchema = Joi.object({
        username: Joi.string().alphanum().min(3).required().messages({
                "string.min": `"username" should have a minimum length of {#limit}`,
                "any.required": `"username" is a required field`,
        }),

        email: Joi.string().email().required().messages({
                "string.email": `"email" must be a valid email`,
                "any.required": `"email" is a required field`,
        }),

        password: Joi.string()
                .min(8)
                .required()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
                .messages({
                        "string.min": `"password" should have a minimum length of {#limit}`,
                        "string.pattern.base": `"password" must include one uppercase letter, one lowercase letter, one number, and one symbol`,
                        "any.required": `"password" is a required field`,
                }),
});

async function register(req: Request, res: Response): Promise<Response | void> {
        try {
                // Validate user input using Joi schema
                const { error, value } = registerSchema.validate(req.body);
                if (error) {
                        return res.status(400).send(error.details[0].message);
                }

                // Extract values
                const { username, email, password } = value;

                // Check if user already exists
                const existingUser = await User.findOne({
                        where: {
                                [Op.or]: [{ email }, { username }],
                        },
                });

                if (existingUser) {
                        let message = "The following already in use: ";
                        if (existingUser.email === email) {
                                message += "email ";
                        }
                        if (existingUser.username === username) {
                                message += "username";
                        }
                        return res.status(400).send(message.trim());
                }

                const user = await User.create({
                        username,
                        email,
                        password: password,
                });

                res.status(201).send({
                        message: "User created successfully",
                        user: { id: user.id, username, email },
                });
        } catch (err: unknown) {
                console.error(err);
                return res.status(500).send("An unexpected error occurred");
        }
}

export default register;
