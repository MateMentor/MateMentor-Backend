/** @format */

// server.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "./HttpError";
import helmet from "helmet";
import compression from "compression";

import logger from "./logger"; // Make sure this is your Winston logger

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

// Routes
app.get("/", (req: Request, res: Response) => {
        logger.info("Hello world route was accessed.");
        res.send("Hello world1");
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        logger.error(err.stack);
        let errorMessage = "Something broke!";

        // If it's an HttpError, use its message and status
        if (err instanceof HttpError) {
                res.status(err.status).send({
                        error: true,
                        message: err.message,
                });
        } else {
                // In development, provide stack trace, else a generic message
                if (process.env.NODE_ENV === "development") {
                        errorMessage = err.stack || errorMessage;
                }
                res.status(500).send({ error: true, message: errorMessage });
        }
});

// Start the server
app.listen(PORT, () => {
        logger.info(`Server is running on ${PORT} 🔥🚀`);
});
