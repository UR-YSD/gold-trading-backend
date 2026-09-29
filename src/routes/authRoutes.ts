import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/authController";

const router = Router();

// Rate limiting for auth routes (e.g. max 10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;
