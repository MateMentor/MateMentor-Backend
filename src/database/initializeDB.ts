/** @format */
import dotenv from "dotenv";

import logger from "../utilities/logger";
import connectToDatabase from "./connectDB";
import syncModels from "./syncModels";
import "./models/User";

dotenv.config();

async function initializeDatabase() {
        try {
                await connectToDatabase();
                await syncModels();
        } catch (error) {
                logger.error("Failed to initialize database:", error);
                process.exit(1);
        }
}

initializeDatabase();
