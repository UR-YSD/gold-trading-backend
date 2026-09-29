import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
  } from "sequelize";
  
  import sequelize from "../config/database";
  
  class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    declare id: CreationOptional<string>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: "admin" | "user";
    declare balance: CreationOptional<number>;
    declare goldBalance: CreationOptional<number>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
  
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
  
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
  
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
  
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user"
      },
  
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active"
      },
  
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00
      },
  
      goldBalance: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0.0000,
        field: "gold_balance"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at"
      }
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  
  export default User;