// User.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize';  // ensure this points to your sequelize instance
import bcrypt from 'bcrypt';
import Joi from 'joi';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;  

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}


User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, 
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true 
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, 
    }
  }
}, {
  sequelize, 
  modelName: 'User', 
});

User.beforeCreate(async (user) => {
  user.password = await User.hashPassword(user.password);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await User.hashPassword(user.password);
  }
});

export default User;
