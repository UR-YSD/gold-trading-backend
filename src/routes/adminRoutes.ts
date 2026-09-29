import { Router } from "express";
import { getAllUsers, getAllTransactions, deactivateUser } from "../controllers/adminController";
import { verifyToken, isAdmin } from "../middleware/auth";

const router = Router();

// Require both valid JWT and Admin role
router.use(verifyToken);
router.use(isAdmin);

router.get("/users", getAllUsers);
router.get("/transactions", getAllTransactions);
router.patch("/users/:id/toggle-active", deactivateUser);

export default router;
