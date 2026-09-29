import { Request, Response } from "express";
import { User, Transaction, Trade } from "../models";
import { Op } from "sequelize";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ["id", "name", "email", "role", "balance", "goldBalance", "isActive", "createdAt"],
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      users: rows
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Filters
    const { userId, type, startDate, endDate } = req.query;
    
    let whereCondition: any = {};

    if (userId) {
      whereCondition.userId = userId;
    }
    if (type) {
      whereCondition.type = type; // "deposit" | "withdraw" | "trade"
    }
    if (startDate && endDate) {
      whereCondition.createdAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    } else if (startDate) {
      whereCondition.createdAt = {
        [Op.gte]: new Date(startDate as string)
      };
    } else if (endDate) {
      whereCondition.createdAt = {
        [Op.lte]: new Date(endDate as string)
      };
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"]
        }
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      transactions: rows
    });
  } catch (error) {
    console.error("Get All Transactions Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id as string);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Toggle active status
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("Deactivate User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
