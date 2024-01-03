/** @format */

// User.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize"; // ensure this points to your sequelize instance
import bcrypt from "bcrypt";
import Joi from "joi";

class User extends Model {
        public id!: number;
        public username!: string;
        public email!: string;
        public password!: string;
        public loginAttempts!: number;
        public lockUntil!: number;

        static async hashPassword(password: string): Promise<string> {
                const salt = await bcrypt.genSalt(10);
                return bcrypt.hash(password, salt);
        }
}

User.init(
        {
                username: {
                        type: DataTypes.STRING,
                        unique: true,
                        allowNull: false,
                        validate: {
                                notEmpty: true,
                        },
                },
                email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                        validate: {
                                isEmail: true,
                        },
                },
                password: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                                notEmpty: true,
                        },
                },
                lockUntil: {
                        type: DataTypes.DATE,
                        allowNull: true, // Allow null for no lock
                },
                loginAttempts: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0, // Default to 0 attempts
                },
        },
        {
                sequelize,
                modelName: "User",
        },
);

User.beforeCreate(async (user) => {
        user.password = await User.hashPassword(user.password);
});

User.beforeUpdate(async (user) => {
        if (user.changed("password")) {
                user.password = await User.hashPassword(user.password);
        }
});

export default User;
