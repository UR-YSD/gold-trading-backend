import { Router } from "express";
import { buyGold, sellGold } from "../controllers/tradeController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.use(verifyToken);

router.post("/buy", buyGold);
router.post("/sell", sellGold);

export default router;
