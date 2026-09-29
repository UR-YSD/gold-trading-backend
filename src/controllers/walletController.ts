import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { User, Transaction, sequelize } from "../models";
import { z } from "zod";

const depositWithdrawSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0")
});

export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      balance: user.balance,
      goldBalance: user.goldBalance
    });
  } catch (error) {
    console.error("Get Balance Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deposit = async (req: AuthRequest, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    
    const parseResult = depositWithdrawSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.issues });
      await transaction.rollback();
      return;
    }

    const { amount } = parseResult.data;

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      await transaction.rollback();
      return;
    }

    // Update balance
    user.balance = Number(user.balance) + amount;
    await user.save({ transaction });

    // Create transaction history
    await Transaction.create({
      userId: user.id,
      type: "deposit",
      amount: amount
    }, { transaction });

    await transaction.commit();

    res.json({
      message: "Deposit successful",
      balance: user.balance
    });
  } catch (error) {
    console.error("Deposit Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};

export const withdraw = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    
    const parseResult = depositWithdrawSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.issues });
      await t.rollback();
      return;
    }

    const { amount } = parseResult.data;

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      await t.rollback();
      return;
    }

    if (Number(user.balance) < amount) {
      res.status(400).json({ message: "Insufficient balance" });
      await t.rollback();
      return;
    }

    // Update balance
    user.balance = Number(user.balance) - amount;
    await user.save({ transaction: t });

    // Create transaction history
    await Transaction.create({
      userId: user.id,
      type: "withdraw",
      amount: amount
    }, { transaction: t });

    await t.commit();

    res.json({
      message: "Withdrawal successful",
      balance: user.balance
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    await t.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};
