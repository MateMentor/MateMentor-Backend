/** @format */

import sequelize from "./sequelize";
import logger from "../utilities/logger";

async function connectToDatabase(retries = 5, interval = 5000) {
        while (retries) {
                try {
                        await sequelize.authenticate();
                        logger.info(
                                "Connection has been established successfully.",
                        );
                        return;
                } catch (error) {
                        retries -= 1;
                        logger.error(
                                `Unable to connect to the database. Retrying in ${
                                        interval / 1000
                                } seconds...`,
                                error,
                        );

                        if (retries === 0) {
                                logger.error(
                                        "No more retries left. Unable to establish database connection.",
                                );
                                throw error;
                        }
                        await new Promise((res) => setTimeout(res, interval));
                }
        }
}

export default connectToDatabase;
