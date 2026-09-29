import User from "./User";
import Transaction from "./Transaction";
import Trade from "./Trade";
import sequelize from "../config/database";

User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Trade, { foreignKey: "userId", as: "trades" });
Trade.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Transaction, Trade };
