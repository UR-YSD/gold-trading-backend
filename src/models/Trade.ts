import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "sequelize";

import sequelize from "../config/database";

class Trade extends Model<
  InferAttributes<Trade>,
  InferCreationAttributes<Trade>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare type: "buy" | "sell";
  declare goldAmount: number;
  declare pricePerGram: number;
  declare totalCost: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Trade.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id"
    },
    type: {
      type: DataTypes.ENUM("buy", "sell"),
      allowNull: false
    },
    goldAmount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      field: "gold_amount"
    },
    pricePerGram: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "price_per_gram"
    },
    totalCost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "total_cost"
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
    tableName: "trades",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Trade;
