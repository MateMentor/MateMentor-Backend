/** @format */

import logger from "../utilities/logger";
import sequelize from "./sequelize";

async function syncModels() {
        try {
                await sequelize.sync({ force: true });
                logger.info("All models were synchronized successfully.");
        } catch (error) {
                logger.error("Unable to synchronize models:", error);
                throw error;
        }
}

export default syncModels;
