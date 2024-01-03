/** @format */

import sequelize from "./sequelize";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "./HttpError";
import helmet from "helmet";
import compression from "compression";
import "./db";

import logger from "./logger";

import authRouter from "./routes/authRoutes";

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
        res.send("Hello world!");
});

app.use("/api/v1/auth", authRouter);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        logger.error(err.stack);
        let errorMessage = "Something broke!";

        if (err instanceof HttpError) {
                res.status(err.status).send({
                        error: true,
                        message: err.message,
                });
        } else {
                if (process.env.NODE_ENV === "development") {
                        errorMessage = err.stack || errorMessage;
                }
                res.status(500).send({ error: true, message: errorMessage });
        }
});

// Start the server
sequelize.sync({}).then(() => {
        app.listen(PORT, () => {
                logger.info(`Server is running on ${PORT} 🔥🚀`);
        });
});

process.on("SIGINT", async () => {
        logger.info("Closing database connection...");
        await sequelize.close();
        logger.info("Database connection closed. Exiting now...");
        process.exit();
});
