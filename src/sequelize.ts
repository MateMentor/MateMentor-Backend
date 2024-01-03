import { Sequelize } from "sequelize";

const sequelize = new Sequelize("chess_db", "myuser", "mypassword", {
    host: "localhost",
    dialect: "postgres",
  });
  
  export default sequelize;