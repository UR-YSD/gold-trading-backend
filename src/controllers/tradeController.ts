import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { User, Transaction, Trade, sequelize } from "../models";
import { z } from "zod";

const tradeSchema = z.object({
  goldAmount: z.number().positive("Gold amount must be greater than 0")
});

// Mocked static gold price per gram
const GOLD_PRICE_PER_GRAM = 65.00;

export const buyGold = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    
    const parseResult = tradeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.issues });
      await t.rollback();
      return;
    }

    const { goldAmount } = parseResult.data;
    const totalCost = goldAmount * GOLD_PRICE_PER_GRAM;

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      await t.rollback();
      return;
    }

    if (Number(user.balance) < totalCost) {
      res.status(400).json({ message: "Insufficient balance to buy gold" });
      await t.rollback();
      return;
    }

    // Update balances
    user.balance = Number(user.balance) - totalCost;
    user.goldBalance = Number(user.goldBalance) + goldAmount;
    await user.save({ transaction: t });

    // Create Trade log
    await Trade.create({
      userId: user.id,
      type: "buy",
      goldAmount: goldAmount,
      pricePerGram: GOLD_PRICE_PER_GRAM,
      totalCost: totalCost
    }, { transaction: t });

    // Create Transaction history
    await Transaction.create({
      userId: user.id,
      type: "trade",
      amount: totalCost // represents money spent
    }, { transaction: t });

    await t.commit();

    res.json({
      message: "Gold purchased successfully",
      balance: user.balance,
      goldBalance: user.goldBalance
    });
  } catch (error) {
    console.error("Buy Gold Error:", error);
    await t.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sellGold = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    
    const parseResult = tradeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.issues });
      await t.rollback();
      return;
    }

    const { goldAmount } = parseResult.data;
    const totalRevenue = goldAmount * GOLD_PRICE_PER_GRAM;

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      await t.rollback();
      return;
    }

    if (Number(user.goldBalance) < goldAmount) {
      res.status(400).json({ message: "Cannot sell more gold than owned" });
      await t.rollback();
      return;
    }

    // Update balances
    user.balance = Number(user.balance) + totalRevenue;
    user.goldBalance = Number(user.goldBalance) - goldAmount;
    await user.save({ transaction: t });

    // Create Trade log
    await Trade.create({
      userId: user.id,
      type: "sell",
      goldAmount: goldAmount,
      pricePerGram: GOLD_PRICE_PER_GRAM,
      totalCost: totalRevenue
    }, { transaction: t });

    // Create Transaction history
    await Transaction.create({
      userId: user.id,
      type: "trade",
      amount: totalRevenue // represents money gained
    }, { transaction: t });

    await t.commit();

    res.json({
      message: "Gold sold successfully",
      balance: user.balance,
      goldBalance: user.goldBalance
    });
  } catch (error) {
    console.error("Sell Gold Error:", error);
    await t.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
};
