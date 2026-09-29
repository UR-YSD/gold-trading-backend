import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getBalance, deposit, withdraw } from "../controllers/walletController";
import { verifyToken } from "../middleware/auth";

const router = Router();

const transactionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { message: "Too many transactions from this IP, please try again later" }
});

router.use(verifyToken);

router.get("/balance", getBalance);
router.post("/deposit", transactionLimiter, deposit);
router.post("/withdraw", transactionLimiter, withdraw);

export default router;
