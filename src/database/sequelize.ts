/** @format */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
        "chess_db",
        "myuser",
        `${process.env.SUPERUSER}`,
        {
                host: "localhost",
                dialect: "postgres",
        },
);

export default sequelize;
