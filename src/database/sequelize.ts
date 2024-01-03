/** @format */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const password = process.env.SUPERUSER;

const sequelize = new Sequelize("chess_db", "myuser", password, {
        host: "localhost",
        dialect: "postgres",
});

export default sequelize;
