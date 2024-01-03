// db.ts
import logger from "./logger";
import sequelize from "./sequelize";
import "./models/User"; 

const isDevEnvironment = process.env.NODE_ENV === 'development';

async function connectToDatabase(retries = 5, interval = 5000) {
    while (retries) {
        try {
            await sequelize.authenticate();
            logger.info("Connection has been established successfully.");
            return; 
        } catch (error) {
            retries -= 1; 
            logger.error(`Unable to connect to the database. Retrying in ${interval / 1000} seconds...`, error);

            if (retries === 0) {
                logger.error("No more retries left. Unable to establish database connection.");
                throw error; 
            }
            await new Promise(res => setTimeout(res, interval));
        }
    }
}

async function syncModels() {
    try {
        await sequelize.sync({ force: isDevEnvironment });
        logger.info("All models were synchronized successfully.");
    } catch (error) {
        logger.error("Unable to synchronize models:", error);
        throw error; 
    }
}

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
