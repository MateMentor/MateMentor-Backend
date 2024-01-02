/** @format */

import { Sequelize } from "sequelize";
import logger from "./logger";

const sequelize = new Sequelize("chess_db", "myuser", "mypassword", {
        host: "localhost",
        dialect: "postgres",
});

export default sequelize;

// Test the connection
async function testDB() {
        try {
                await sequelize.authenticate();
                logger.info("Connection has been established successfully."); // Log success with Winston
        } catch (error) {
                logger.error("Unable to connect to the database:", error); // Log error with Winston
        }
}

testDB();
